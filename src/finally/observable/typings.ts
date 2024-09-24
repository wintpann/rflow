import { Lazy, SelfPipe } from '../common';

export type APIRecord = Record<string, (...args: any[]) => unknown>;

export type Next<Value> = (value: Value | ((prev: Value) => Value)) => void;

export type CreateAPI<Value, API extends APIRecord> = (
  next: Next<Value>,
) => API;

export type Reflect<Value> = (
  internals: ObservableInternals<Value>,
) => DestroyFunction | void;

export interface Callable<Value> {
  (): Value;
}

export type ObserveFunction<Value> = (
  callback: (value: Value) => void,
) => UnobserveFunction;

export type WatchFunction<Value> = (
  callback: (value: Value) => void,
) => UnwatchFunction;

export type UnobserveFunction = Lazy;
export type UnwatchFunction = Lazy;
export type DestroyFunction = Lazy;

export type NoAPI = Record<string, never>;

export type SanitizeAPI<API extends APIRecord> = API extends Record<
  'observe',
  any
>
  ? never
  : API extends Record<'pipe', any>
  ? never
  : API extends Record<'_unsafe', any>
  ? never
  : API;

export type Observable<Value, API extends APIRecord = NoAPI> = Callable<Value> &
  SanitizeAPI<API> & {
    observe: ObserveFunction<Value>;
    pipe: SelfPipe<Observable<Value>>;
    _unsafe: {
      watch: WatchFunction<Value>;
      destroy: Lazy;
      type: 'observable';
    };
  };

export type ObservableValue<T extends Observable<any, NonNullable<unknown>>> =
  ReturnType<T>;

export type ObservableInternals<Value> = {
  next: Next<Value>;
};

export type CreateObservable<Value> = {
  create: <API extends APIRecord = NoAPI>(
    api?: CreateAPI<Value, API> | null,
    reflect?: Reflect<Value>,
  ) => Observable<Value, API>;
};

export interface NewObservable {
  <Value>(value: Value): CreateObservable<Value>;
}
