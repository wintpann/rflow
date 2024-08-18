import {
  APIRecord,
  CreateOptions,
  NewObservable,
  Next,
  NoAPI,
  Observable,
  ObservableInternals,
  onBecomesUnobserved,
} from './typings.ts';
import { Lazy, die, pipe } from '../common';
import { scheduler } from '../scheduler';

const UNSUPPORTED_API_HANDLER_NAMES = new Set(['$type', 'observe', 'pipe']);
const INTERNALS_KEY = Symbol('internals');

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?.$type === 'observable';

export const newObservable = <Value>(value: Value) => ({
  create: <API extends APIRecord = NoAPI>({
    api,
    reflect,
  }: CreateOptions<Value, API> = {}) => {
    const observers = new Set<Lazy>();
    let onBecomesUnobserved: onBecomesUnobserved | void;
    let observed = false;
    let current = value;

    const callObservers = () => {
      for (const observer of observers.values()) {
        observer();
      }
    };

    const internals: ObservableInternals<Value> = {
      next: (value, options) => {
        const scheduleUpdate = options?.scheduleUpdate ?? true;
        const updated = value instanceof Function ? value(current) : value;

        if (updated !== current) {
          current = updated;
          if (scheduleUpdate) {
            scheduler.schedule(callObservers);
          }
        }
      },
      hasScheduledUpdate: () => scheduler.isScheduled(callObservers),
      isObserved: () => observed,
    };

    const onRead = reflect?.onRead;
    const read = onRead
      ? () => {
          onRead(internals);
          return current;
        }
      : () => current;

    const instance = read as Observable<Value, API>;
    instance.$type = 'observable';
    (instance as any)[INTERNALS_KEY] = internals;

    if (api) {
      const next: Next<Value> = (value) => internals.next(value);
      const record = api(next);
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
      const becameObserved = !observed;
      if (becameObserved && reflect?.onBecomesObserved) {
        onBecomesUnobserved = reflect.onBecomesObserved(internals);
      }
      observed = true;

      return () => {
        observers.delete(observer);
        const becameUnobserved = observers.size === 0;
        if (becameUnobserved && onBecomesUnobserved) {
          onBecomesUnobserved(internals);
        }
        observed = observers.size > 0;
      };
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
  observable<Value>(value).create({
    api: (next) => ({ next }),
  });

export const reflect = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
): ObservableInternals<Value> => (observable as any)[INTERNALS_KEY];
