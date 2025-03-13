import {
  APIRecord,
  Next,
  NoAPI,
  Observable,
  ObservableAdministration,
  Operate,
  MakeObservable,
  ObserveFunction,
} from './typings.ts';
import { Lazy, pipe } from '../shared';
import { nextTickScheduler } from '../scheduler';

const ADMINISTRATION = Symbol('$observable');

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => !!target?.[ADMINISTRATION];

const untypedPipe = pipe as (value: any, ...fns: any) => any;

const makeObservable = <Value>(value: Value) => ({
  api: <API extends APIRecord = NoAPI>(api?: (next: Next<Value>) => API) => {
    const state = {
      value,
      observers: new Set<Lazy>(),
      scheduledObservers: new Set<Lazy>(),
      syncObservers: new Set<Lazy>(),
      updatedTimestamp: Date.now(),
    };

    const invokeObservers = () => {
      for (const callback of state.scheduledObservers.values()) {
        if (state.observers.has(callback)) {
          callback();
        }
      }
    };

    const invokeSyncObservers = () => {
      for (const callback of state.syncObservers.values()) {
        callback();
      }
    };

    const self = () => state.value;

    const next: Next<Value> = (value) => {
      state.value = value instanceof Function ? value(state.value) : value;
      state.updatedTimestamp = Date.now();
      invokeSyncObservers();
      state.scheduledObservers = new Set(state.observers);
      nextTickScheduler.schedule(invokeObservers);
    };

    const observe: ObserveFunction<Value> = (callback) => {
      const observer = () => callback(state.value);
      state.observers.add(observer);

      return () => {
        state.observers.delete(observer);
      };
    };

    const observeSync: ObserveFunction<Value> = (callback) => {
      const watcher = () => callback(state.value);
      state.syncObservers.add(watcher);
      return () => {
        state.syncObservers.delete(watcher);
      };
    };

    const selfPipe = (...fns: any[]): any => untypedPipe(instance, ...fns);

    const instance = self as Observable<Value, API>;

    if (api) {
      const record = api(next);
      for (const [key, handler] of Object.entries(record)) {
        Object.defineProperty(instance, key, {
          value: handler,
          writable: false,
          enumerable: false,
        });
      }
    }

    const administration: ObservableAdministration<Value> = {
      unsafe_state: state,
      helpers: { next, self },
    };

    Object.defineProperty(instance as any, ADMINISTRATION, {
      value: administration,
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(instance, 'pipe', {
      value: selfPipe,
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(instance, 'observe', {
      value: observe,
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(instance, 'observeSync', {
      value: observeSync,
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(instance, 'updatedTimestamp', {
      get() {
        return state.updatedTimestamp;
      },
      enumerable: false,
    });

    return instance as Observable<Value, API>;
  },
});

export const observable = makeObservable as MakeObservable;

export const of = <Value>(
  value: Value,
): Observable<Value, { next: Next<Value> }> =>
  observable<Value>(value).api((next) => ({ next }));

export const admin = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
): ObservableAdministration<Value> => (observable as any)[ADMINISTRATION];

export const operate: Operate = ({ destination, define }) => {
  define(admin(destination).helpers);
  return destination;
};
