import { Lazy } from '../common';

export type APIRecord = Record<string, (...args: any[]) => unknown>;

export type Next<Value> = (value: Value | ((prev: Value) => Value)) => void;

export type CreateAPI<Value, API extends APIRecord> = (
  next: Next<Value>,
) => API;

export interface Callable<Value> {
  (): Value;
}

export type UnobserveFunction = Lazy;

export type ObserveFunction<Value> = (
  callback: (value: Value) => void,
) => UnobserveFunction;

export type NoAPI = Record<string, never>;

export type SanitizedAPI<API extends APIRecord> = API extends Record<
  'observe',
  any
>
  ? never
  : API extends Record<'$type', any>
  ? never
  : API;

export type Observable<Value, API extends APIRecord = NoAPI> = Callable<Value> &
  SanitizedAPI<API> & {
    observe: ObserveFunction<Value>;
    $type: symbol;
  };

export type ObservableInternals<Value> = {
  next: Next<Value>;
  hasScheduledUpdates: () => boolean;
};

export type CreateOptions<Value, API extends APIRecord> = {
  api?: CreateAPI<Value, API>;
};

export type OnBecomesObserved = <Value>(
  observable: Observable<Value>,
  callback: (internals: ObservableInternals<Value>) => void,
) => UnobserveFunction;

export type OnBecomesUnobserved = <Value>(
  observable: Observable<Value>,
  callback: (internals: ObservableInternals<Value>) => void,
) => UnobserveFunction;

export type OnReadValue = <Value>(
  observable: Observable<Value>,
  callback: (internals: ObservableInternals<Value>) => void,
) => UnobserveFunction;

export type CreateObservable<Value> = {
  create: <API extends APIRecord = NoAPI>(
    options?: CreateOptions<Value, API>,
  ) => Observable<Value, API>;
};

export interface NewObservable {
  <Value>(value: Value): CreateObservable<Value>;
}
