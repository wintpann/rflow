import { Lazy, SelfPipe } from '../common';

export type APIRecord = Record<string, (...args: any[]) => unknown>;

export type Next<Value> = (value: Value | ((prev: Value) => Value)) => void;
export type NextInternal<Value> = (
  value: Value | ((prev: Value) => Value),
  options?: { scheduleUpdate?: boolean },
) => void;

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
  : API extends Record<'pipe', any>
  ? never
  : API extends Record<'$type', any>
  ? never
  : API;

export type Observable<Value, API extends APIRecord = NoAPI> = Callable<Value> &
  SanitizedAPI<API> & {
    observe: ObserveFunction<Value>;
    pipe: SelfPipe<Observable<Value>>;
    $type: 'observable';
  };

export type ObservableValue<T extends Observable<any, NonNullable<unknown>>> =
  ReturnType<T>;

export type ObservableInternals<Value> = {
  next: NextInternal<Value>;
  hasScheduledUpdate: Lazy<boolean>;
  isObserved: Lazy<boolean>;
};

export type onBecomesUnobserved = <Value>(
  internals: ObservableInternals<Value>,
) => void;

export type ReflectOptions<Value> = {
  onBecomesObserved?: (
    internals: ObservableInternals<Value>,
  ) => onBecomesUnobserved | void;
  onRead?: (internals: ObservableInternals<Value>) => void;
};

export type CreateOptions<Value, API extends APIRecord> = {
  api?: CreateAPI<Value, API>;
  reflect?: ReflectOptions<Value>;
};

export type CreateObservable<Value> = {
  create: <API extends APIRecord = NoAPI>(
    options?: CreateOptions<Value, API>,
  ) => Observable<Value, API>;
};

export interface NewObservable {
  <Value>(value: Value): CreateObservable<Value>;
}
