import { Lazy } from '../common';

export type APIHandler<Value> = (...args: any[]) => Value;

export type APIRecord<Value> = Record<string, APIHandler<Value>>;

export type UnobserveFunction = Lazy;

export type ObserveFunction<Value> = (
  callback: (value: Value) => void,
) => UnobserveFunction;

export type NoAPI = Record<string, never>;

export interface Callable<Value> {
  (): Value;
}

export type Observable<
  Value,
  API extends APIRecord<Value> = NoAPI,
> = Callable<Value> &
  API & {
    observe: ObserveFunction<Value>;
    __type__: 'observable';
  };

export type NewObservable<
  Value,
  API extends APIRecord<Value>,
> = API extends Record<'subscribe', any>
  ? never
  : API extends NoAPI
  ? Observable<Value>
  : Observable<Value, API>;

export type CreateObservableOptions<Value, API extends APIRecord<Value>> = {
  api?: API;
  onObserved?: (callback: (value: Value) => void) => UnobserveFunction | void;
  onBecomesObserved?: () => UnobserveFunction | void;
  onReadValue?: () => void;
};

export type ObservableSetValue<Value> = Value | ((previous: Value) => Value);

export type ObservableController<Value> = {
  notifyObservers: () => void;
  setValue: (value: ObservableSetValue<Value>) => void;
  hasScheduledUpdates: () => boolean;
};

export type CreateObservableOptionsFactory<
  Value,
  API extends APIRecord<Value>,
> = (
  controller: ObservableController<Value>,
) => CreateObservableOptions<Value, API>;
