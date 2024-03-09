import { die, Lazy } from '../common';
import { scheduler } from '../scheduler';
import {
  APIRecord,
  MissedAPI,
  Observable,
  CreateObservableOptions,
  CreateObservableOptionsFactory,
  ObservableController,
  NoAPI,
} from './typings.ts';

const UNSUPPORTED_API_HANDLER_NAMES = new Set(['__type__', 'observe', 'api']);

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?.__type__ === 'observable';

export const createObservable = <Value, API extends APIRecord<Value> = NoAPI>(
  value: Value,
  options?:
    | CreateObservableOptions<Value>
    | CreateObservableOptionsFactory<Value>,
): Observable<Value, API> => {
  const observers = new Set<Lazy>();
  let current = value;

  const runObservers = () => {
    for (const observer of observers.values()) {
      observer();
    }
  };

  const controller: ObservableController<Value> = {
    notifyObservers: () => scheduler.schedule(runObservers),
    setValue: (value) => {
      if (value instanceof Function) {
        current = value(current);
      } else {
        current = value;
      }
    },
    hasScheduledUpdates() {
      return scheduler.isScheduled(runObservers);
    },
  };

  const params = options instanceof Function ? options(controller) : options;

  const instance = (() => {
    params?.onReadValue?.();
    return current;
  }) as Observable<Value, MissedAPI>;
  instance.__type__ = 'observable';

  if (params?.enableAPI) {
    instance.api = <NewAPI extends APIRecord<any>>(record: NewAPI) => {
      for (const [key, handler] of Object.entries(record)) {
        if (UNSUPPORTED_API_HANDLER_NAMES.has(key)) {
          die(
            `API handler cannot have a name of "${Array.from(
              UNSUPPORTED_API_HANDLER_NAMES,
            ).join(', ')}". Used "${key}"`,
          );
        }

        instance[key] = ((...args: any[]) => {
          current = handler(...args);
          controller.notifyObservers();
        }) as Observable<Value, NewAPI>[keyof NewAPI];
      }
      // @ts-ignore
      delete instance.api;
      return instance as unknown as Observable<Value, NewAPI>;
    };
  }

  instance.observe = (callback) => {
    const onUnobserved = params?.onObserved?.(callback);
    const observer = () => callback(current);
    observers.add(observer);

    const becameObserved = observers.size === 1;
    const onBecomesUnobserved = becameObserved
      ? params?.onBecomesObserved?.()
      : undefined;

    return () => {
      onUnobserved?.();
      observers.delete(observer);

      const becameUnobserved = observers.size === 0;
      if (becameUnobserved) {
        onBecomesUnobserved?.();
      }
    };
  };

  return instance as unknown as Observable<Value, API>;
};

export const observable = <Value>(value: Value) =>
  createObservable<Value, MissedAPI>(value, { enableAPI: true });
