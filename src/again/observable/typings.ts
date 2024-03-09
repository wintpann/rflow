import { Lazy } from '../common';

export type APIHandler<Value> = (...args: any[]) => Value;

export type APIRecord<Value> = Record<string, APIHandler<Value>>;

export type UnobserveFunction = Lazy;

export type ObserveFunction<Value> = (
  callback: (value: Value) => void,
) => UnobserveFunction;

export type MissedAPI = Record<string, never>;
export type NoAPI = Record<string, any>;

export interface Callable<Value> {
  (): Value;
}

export type APIMixin<
  Value,
  OriginalAPI extends APIRecord<Value>,
> = OriginalAPI extends MissedAPI
  ? {
      api: <NewAPI extends APIRecord<Value>>(
        record: NewAPI,
      ) => Observable<Value, NewAPI>;
    }
  : Record<string, never>;

export type SanitizedAPI<API extends APIRecord<any>> = API extends Record<
  'observe',
  any
>
  ? never
  : API extends Record<'api', any>
  ? never
  : API extends Record<'__type__', any>
  ? never
  : API;

export type Observable<
  Value,
  API extends APIRecord<Value> = NoAPI,
> = Callable<Value> &
  SanitizedAPI<API> & {
    observe: ObserveFunction<Value>;
    __type__: 'observable';
  } & APIMixin<Value, API>;

export type CreateObservableOptions<Value> = {
  enableAPI?: boolean;
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

export type CreateObservableOptionsFactory<Value> = (
  controller: ObservableController<Value>,
) => CreateObservableOptions<Value>;
