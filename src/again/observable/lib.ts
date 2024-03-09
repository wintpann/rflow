import { die, Lazy } from '../common';
import { scheduler } from '../scheduler';
import {
  APIRecord,
  NewObservable,
  NoAPI,
  Observable,
  CreateObservableOptions,
  CreateObservableOptionsFactory,
  ObservableController,
} from './typings.ts';

export const isObservable = <Value = any>(
  target: any,
): target is Observable<Value> => target?.__type__ === 'observable';

export const createObservable = <Value, API extends APIRecord<Value> = NoAPI>(
  value: Value,
  options:
    | CreateObservableOptions<Value, API>
    | CreateObservableOptionsFactory<Value, API>,
): NewObservable<Value, API> => {
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
    params.onReadValue?.();
    return current;
  }) as Observable<Value, API>;
  instance.__type__ = 'observable';

  if (params.api) {
    for (const [key, handler] of Object.entries(params.api)) {
      if (key === 'subscribe') {
        die('API handler cannot have a name of "subscribe"');
      }

      instance[key as keyof API] = ((...args: any[]) => {
        current = handler(...args);
        controller.notifyObservers();
      }) as Observable<Value, API>[keyof API];
    }
  }

  instance.observe = (callback) => {
    const onUnobserved = params.onObserved?.(callback);
    const observer = () => callback(current);
    observers.add(observer);
    const becameObserved = observers.size === 1;
    const onBecomesUnobserved = becameObserved
      ? params.onBecomesObserved?.()
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

  return instance as NewObservable<Value, API>;
};

export const observable = <Value, API extends APIRecord<Value> = NoAPI>(
  value: Value,
  api?: API,
): NewObservable<Value, API> => createObservable(value, { api });
