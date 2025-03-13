import { Lazy, SelfPipe } from '../shared';

export type APIRecord = Record<string, (...args: any[]) => unknown>;

export type Next<Value> = (value: Value | ((prev: Value) => Value)) => void;

export type OnDestroy = Lazy;

export interface Operate {
  <Destination extends Observable>(parameters: {
    destination: Destination;
    define: (
      helpers: ObservableAdministration<
        ObservableValue<Destination>
      >['helpers'],
    ) => OnDestroy | OnDestroy[] | void;
  }): Destination;
}

export type ObserveFunction<Value> = (
  callback: (value: Value) => void,
) => UnobserveFunction;

export type UnobserveFunction = Lazy;

export interface Callable<Value> {
  (): Value;
}

export type NoAPI = Record<string, never>;

export type Observable<
  Value = any,
  API extends APIRecord = NonNullable<unknown>,
> = Callable<Value> &
  Omit<API, 'observe' | 'observeSync' | 'pipe' | 'updatedTimestamp'> & {
    observe: ObserveFunction<Value>;
    observeSync: ObserveFunction<Value>;
    pipe: SelfPipe<Observable<Value>>;
    updatedTimestamp: number;
  };

export type ObservableValue<T extends Observable> = ReturnType<T>;

export type ObservableAdministration<Value> = {
  unsafe_state: Readonly<{
    value: Value;
    updatedTimestamp: number;
    observers: Set<Lazy>;
    scheduledObservers: Set<Lazy>;
    syncObservers: Set<Lazy>;
  }>;
  helpers: {
    next: Next<Value>;
    self: Lazy<Value>;
  };
};

export type DeferAPIConstructor<Value> = {
  api: <API extends APIRecord = NoAPI>(
    api?: (next: Next<Value>) => API,
  ) => Observable<Value, API>;
};

export interface MakeObservable {
  <Value>(value: Value): DeferAPIConstructor<Value>;
}
