import {
  APIRecord,
  CreateOptions,
  NewObservable,
  NoAPI,
  Observable,
  ObservableInternals,
} from './typings.ts';
import { Lazy, die } from '../common';
import { scheduler } from '../scheduler';

export const $type = Symbol('observable');

const UNSUPPORTED_API_HANDLER_NAMES = new Set(['$type__', 'observe']);

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?.$type === $type;

export const newObservable = <Value>(value: Value) => ({
  create: <API extends APIRecord = NoAPI>({
    api,
  }: CreateOptions<Value, API> = {}) => {
    const observers = new Set<Lazy>();
    let current = value;

    const callObservers = () => {
      for (const observer of observers.values()) {
        observer();
      }
    };

    const internals: ObservableInternals<Value> = {
      next: (value) => {
        const updated = value instanceof Function ? value(current) : value;
        if (updated !== current) {
          current = updated;
          scheduler.schedule(callObservers);
        }
      },
      hasScheduledUpdates: () => scheduler.isScheduled(callObservers),
    };

    const instance = (() => current) as Observable<Value, API>;
    instance.$type = $type;

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
        instance[key as keyof API] = ((...args: any[]) => {
          handler(...args);
        }) as Observable<Value, API>[keyof API];
      }
    }

    instance.observe = (callback) => {
      const observer = () => callback(current);
      observers.add(observer);
      return () => observers.delete(observer);
    };

    return instance as Observable<Value, API>;
  },
});

export const observable = newObservable as NewObservable;
