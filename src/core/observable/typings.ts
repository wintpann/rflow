import { Lazy, SelfPipe } from '../common/typings.ts';

export type ObservableState<T> = {
  deriver?: Lazy<T>;
  interceptor?: Lazy<T>;
  shouldChain: boolean;
  observed: boolean;
  justCreated: boolean;
  enabled: boolean;
  isDerivation: boolean;
};

export type UnobservedHandler = Lazy;
export type ObservedHandler = Lazy<UnobservedHandler | void>;

export type CreateObservableOptions<T> = Partial<
  Pick<
    ObservableState<T>,
    'deriver' | 'interceptor' | 'shouldChain' | 'enabled'
  >
> & {
  onObserved?: (
    state: ObservableState<T>,
    controller: ObservableController,
  ) => UnobservedHandler | void;
};

export type CreateDerivedObservable<T> = Omit<
  CreateObservableOptions<T>,
  'deriver'
> &
  Pick<Required<CreateObservableOptions<T>>, 'deriver'>;

export type CreateInterceptedObservable<T> = Omit<
  CreateObservableOptions<T>,
  'interceptor'
> &
  Pick<Required<CreateObservableOptions<T>>, 'interceptor'>;

export type ObservableController = {
  derive: () => void;
};

export type ObservableNext<T> = (value: T | ((prev: T) => T)) => void;

export type Observable<T> = {
  $: T;
  value: T;
  raw: T;
  next: ObservableNext<T>;
  pipe: SelfPipe<T>;
};
