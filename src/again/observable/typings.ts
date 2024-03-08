import { Lazy } from '../common';

export type APIHandler<Value> = (...args: any[]) => Value;

export type APIRecord<Value> = Record<string, APIHandler<Value>>;

export type UnsubscribeFunction = Lazy;

export type SubscribeFunction<Value> = (
  callback: (value: Value) => void,
) => UnsubscribeFunction;

export type NoAPI = Record<string, never>;

export interface Callable<Value> {
  (): Value;
}

export interface Subscribable<Value> {
  subscribe: SubscribeFunction<Value>;
}

export type Observable<
  Value,
  API extends APIRecord<Value> = NoAPI,
> = Callable<Value> & Subscribable<Value> & API;

export type NewObservable<
  Value,
  API extends APIRecord<Value>,
> = API extends Record<'subscribe', any>
  ? never
  : API extends NoAPI
  ? Observable<Value>
  : Observable<Value, API>;

export type CreateObservableParams<Value, API extends APIRecord<Value>> = {
  value: { current: Value };
  api?: API;
  onSubscribed?: () => UnsubscribeFunction | void;
  onReadValue?: () => void;
  onNotifyValue?: () => void;
};

export type ObservableController = {
  notifySubscribers: () => void;
};
