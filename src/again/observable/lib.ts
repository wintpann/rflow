import { die, Lazy } from '../common';
import {
  APIRecord,
  NewObservable,
  NoAPI,
  Observable,
  CreateObservableParams,
  ObservableController,
} from './typings.ts';

export const createObservable = <Value, API extends APIRecord<Value> = NoAPI>(
  create: (
    controller: ObservableController,
  ) => CreateObservableParams<Value, API>,
): NewObservable<Value, API> => {
  const subscribers = new Set<Lazy>();

  const controller: ObservableController = {
    notifySubscribers: () => {
      for (const subscriber of subscribers.values()) {
        subscriber();
      }
    },
  };

  const params = create(controller);

  const instance = (() => {
    params.onReadValue?.();
    return params.value.current;
  }) as Observable<Value, API>;

  if (params.api) {
    for (const [key, handler] of Object.entries(params.api)) {
      if (key === 'subscribe') {
        die('API handler cannot have a name of "subscribe"');
      }

      instance[key as unknown as keyof API] = ((...args: any[]) => {
        params.value.current = handler(...args);
        controller.notifySubscribers();
      }) as Observable<Value, API>[keyof API];
    }
  }

  instance.subscribe = (callback) => {
    const onUnsubscribed = params.onSubscribed?.();
    const subscriber = () => {
      params.onNotifyValue?.();
      callback(params.value.current);
    };
    subscribers.add(subscriber);
    return () => {
      onUnsubscribed?.();
      subscribers.delete(subscriber);
    };
  };

  return instance as NewObservable<Value, API>;
};

export const observable = <Value, API extends APIRecord<Value> = NoAPI>(
  value: Value,
  api?: API,
): NewObservable<Value, API> =>
  createObservable(() => ({ value: { current: value }, api }));
