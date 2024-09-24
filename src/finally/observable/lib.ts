import {
  APIRecord,
  CreateAPI,
  NewObservable,
  Next,
  NoAPI,
  Observable,
  ObservableInternals,
  ObservableState,
  Operate,
} from './typings.ts';
import { die, Lazy, pipe } from '../common';
import { scheduler } from '../scheduler';

const UNSUPPORTED_API_HANDLER_NAMES = new Set(['_unsafe', 'observe', 'pipe']);
const INTERNALS_KEY = Symbol('@internals');
const STATE_KEY = Symbol('@state');

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?._unsafe?.type === 'observable';

const call = (actualSet: Set<Lazy>, checkupSet?: Set<Lazy>) => {
  for (const callback of actualSet.values()) {
    if (checkupSet ? checkupSet.has(callback) : true) {
      callback();
    }
  }
};

export const newObservable = <Value>(value: Value) => ({
  create: <API extends APIRecord = NoAPI>(
    api?: CreateAPI<Value, API> | null,
  ) => {
    const state: ObservableState<Value> = {
      value,
      destroyed: false,
      observers: new Set<Lazy>(),
      scheduledObservers: new Set<Lazy>(),
      watchers: new Set<Lazy>(),
      destroyers: new Set<Lazy>(),
    };

    const callObservers = () => call(state.scheduledObservers, state.observers);
    const callWatchers = () => call(state.watchers);
    const callDestroyers = () => call(state.destroyers);

    const internals: ObservableInternals<Value> = {
      next: (value) => {
        state.value = value instanceof Function ? value(state.value) : value;
        callWatchers();
        state.scheduledObservers = new Set(state.observers);
        scheduler.schedule(callObservers);
      },
    };

    const read = () => state.value;

    const instance = read as Observable<Value, API>;
    (instance as any)[INTERNALS_KEY] = internals;
    (instance as any)[STATE_KEY] = state;

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
      const observer = () => callback(state.value);
      state.observers.add(observer);

      return () => {
        state.observers.delete(observer);
      };
    };

    instance._unsafe = {
      destroy: () => {
        callDestroyers();
        state.destroyed = true;
      },
      watch: (callback) => {
        const watcher = () => callback(state.value);
        state.watchers.add(watcher);

        return () => {
          state.watchers.delete(watcher);
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

const getInternals = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
): ObservableInternals<Value> => (observable as any)[INTERNALS_KEY];

const getState = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
): ObservableState<Value> => (observable as any)[STATE_KEY];

export const operate: Operate = ({ destination, define }) => {
  if (define) {
    const onDestroy = define(getInternals(destination));
    if (onDestroy) {
      getState(destination).destroyers.add(onDestroy);
    }
  }
  return destination;
};
