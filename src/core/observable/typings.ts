import { Lazy } from '../common/typings.ts';
import { Observable } from './lib.ts';

export type ObservableState<T> = {
  deriver?: Lazy<T>;
  interceptor?: Lazy<T>;
  shouldChain: boolean;
  observed: boolean;
  justCreated: boolean;
  enabled: boolean;
  isDerivation: boolean;
  BUODisposer?: Lazy | void;
};

export type UnobservedHandler = Lazy;

export type CreateObservableOptions<T> = {
  deriver?: ObservableState<T>['deriver'];
  interceptor?: ObservableState<T>['interceptor'];
  shouldChain?: ObservableState<T>['shouldChain'];
  enabled?: ObservableState<T>['enabled'];
  onObserved?: (
    self: Observable<T>,
    state: ObservableState<T>,
    controller: ObservableController,
  ) => UnobservedHandler | void;
};

export type CreateDerivedObservable<T> = {
  deriver: ObservableState<T>['deriver'];
  shouldChain?: ObservableState<T>['shouldChain'];
  enabled?: ObservableState<T>['enabled'];
  onObserved?: CreateObservableOptions<T>['onObserved'];
};

export type CreateInterceptedObservable<T> = {
  interceptor: ObservableState<T>['interceptor'];
  shouldChain?: ObservableState<T>['shouldChain'];
  enabled?: ObservableState<T>['enabled'];
  onObserved?: CreateObservableOptions<T>['onObserved'];
};

export type ObservableController = {
  derive: () => void;
};

export type ObservableNext<T> = (value: T) => void;
export type ObservableUpdate<T> = (callback: (prev: T) => T) => void;
export type ObservableMutate<T> = (callback: (value: T) => void) => void;
