import {
  APIRecord,
  CreateAPI,
  NewObservable,
  Next,
  NoAPI,
  Observable,
  ObservableInternals,
  Reflect,
} from './typings.ts';
import { die, Lazy, pipe } from '../common';
import { scheduler } from '../scheduler';

const UNSUPPORTED_API_HANDLER_NAMES = new Set(['_unsafe', 'observe', 'pipe']);
const INTERNALS_KEY = Symbol('internals');

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?._unsafe?.type === 'observable';

export const newObservable = <Value>(value: Value) => ({
  create: <API extends APIRecord = NoAPI>(
    api?: CreateAPI<Value, API> | null,
    reflect?: Reflect<Value>,
  ) => {
    let nextUpdateObservers = new Set<Lazy>();
    const observers = new Set<Lazy>();
    const watchers = new Set<Lazy>();

    let current = value;

    const callObservers = () => {
      for (const observer of nextUpdateObservers.values()) {
        if (observers.has(observer)) {
          observer();
        }
      }
    };

    const callWatchers = () => {
      for (const watcher of watchers.values()) {
        watcher();
      }
    };

    const internals: ObservableInternals<Value> = {
      next: (value) => {
        current = value instanceof Function ? value(current) : value;
        callWatchers();
        nextUpdateObservers = new Set(observers);
        scheduler.schedule(callObservers);
      },
    };

    const read = () => current;

    const instance = read as Observable<Value, API>;
    (instance as any)[INTERNALS_KEY] = internals;

    if (api) {
      const record = api(internals.next);
      for (const [key, handler] of Object.entries(record)) {
        if (UNSUPPORTED_API_HANDLER_NAMES.has(key)) {
          die(
            `API handler cannot have a name of "${Array.from(
              UNSUPPORTED_API_HANDLER_NAMES,
            ).join(', ')}". Used "${key}"`,
          );
        }
        instance[key as keyof API] = handler as Observable<
          Value,
          API
        >[keyof API];
      }
    }

    instance.observe = (callback) => {
      const observer = () => callback(current);
      observers.add(observer);

      return () => {
        observers.delete(observer);
      };
    };
    const onDestroy = reflect?.(internals);

    instance._unsafe = {
      destroy: () => onDestroy?.(),
      watch: (callback) => {
        const watcher = () => callback(current);
        watchers.add(watcher);

        return () => {
          watchers.delete(watcher);
        };
      },
      type: 'observable',
    };

    // @ts-ignore
    instance.pipe = (...fns: any[]): any => pipe(instance, ...fns);

    return instance as Observable<Value, API>;
  },
});

export const observable = newObservable as NewObservable;

export const of = <Value>(
  value: Value,
): Observable<Value, { next: Next<Value> }> =>
  observable<Value>(value).create((next) => ({ next }));

export const internals = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
): ObservableInternals<Value> => (observable as any)[INTERNALS_KEY];
