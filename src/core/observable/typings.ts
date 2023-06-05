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
  lastUpdatedTime: number;
  timesUpdated: number;
};

export type UnobservedHandler = Lazy;

export type CreateObservableOptions<T> = {
  deriver?: ObservableState<T>['deriver'];
  interceptor?: ObservableState<T>['interceptor'];
  shouldChain?: ObservableState<T>['shouldChain'];
  enabled?: ObservableState<T>['enabled'];
  onObserved?: (
    self: Observable<T>,
    state: Readonly<ObservableState<T>>,
    controller: Readonly<ObservableController>,
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
