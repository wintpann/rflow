import {
  action,
  getDebugName,
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  toJS,
  untracked,
} from 'mobx';

import { SelfPipe } from '../common/typings.ts';
import { debug, die, pipe } from '../common/lib.ts';

import {
  CreateObservableOptions,
  CreateDerivedObservable,
  CreateInterceptedObservable,
  ObservableController,
  ObservableState,
} from './typings.ts';

const $Controller = Symbol('ObservableController');
const $State = Symbol('ObservableState');
const $Value = Symbol('ObservableValue');

export class Observable<T> {
  [$Controller]: ObservableController;
  [$State]: ObservableState<T>;
  [$Value]: T;

  // @ts-ignore
  pipe: SelfPipe<Observable<T>> = (...fns: any[]): any => pipe(this, ...fns);

  next(value: T) {
    this[$Value] = value;
    this[$State].lastUpdatedTime = Date.now();
  }

  update(callback: (prev: T) => T) {
    this[$Value] = callback(this[$Value]);
    this[$State].lastUpdatedTime = Date.now();
  }

  mutate(callback: (value: T) => void) {
    callback(this[$Value]);
    this[$State].lastUpdatedTime = Date.now();
  }

  constructor(value: T, options?: CreateObservableOptions<T>) {
    this[$Value] = value;

    const getIsDerivation = () =>
      !!this[$State].deriver || !!this[$State].interceptor;

    this[$State] = {
      deriver: options?.deriver,
      interceptor: options?.interceptor,
      shouldChain: options?.shouldChain ?? false,
      enabled: options?.enabled ?? true,
      observed: false,
      justCreated: true,
      get isDerivation() {
        return getIsDerivation();
      },
      lastUpdatedTime: Date.now(),
    };

    this[$Controller] = {
      derive: () => {
        if (this[$State].deriver) {
          this.next(untracked(() => this[$State].deriver!()));
        } else {
          die('No deriver set');
        }
      },
    };

    makeAutoObservable(this, {
      pipe: false,
      next: action,
      update: action,
      mutate: action,
      [$Controller]: false,
      [$State]: false,
    });

    onBecomeObserved(this, 'value', () => {
      debug('observed', getDebugName(this));
      this[$State].observed = true;
      this[$State].BUODisposer = options?.onObserved?.(
        this,
        this[$State],
        this[$Controller],
      );
    });

    onBecomeUnobserved(this, 'value', () => {
      debug('UNOBSERVED', getDebugName(this));
      this[$State].observed = false;

      this[$State].BUODisposer?.();
    });

    setTimeout(() => {
      this[$State].justCreated = false;
    });
  }

  get value() {
    if (this[$State].interceptor) {
      return this[$State].interceptor();
    } else if (this[$State].deriver && !this[$State].observed) {
      this[$Controller].derive();
    }

    return this[$Value];
  }

  get raw() {
    return toJS(this.value);
  }

  get lastUpdatedTime() {
    return this[$State].lastUpdatedTime;
  }
}

export const createObservable = <T>(
  value: T,
  options?: CreateObservableOptions<T>,
) => new Observable<T>(value, options);

export const createDerivation = <T>(
  options: CreateDerivedObservable<T> | CreateInterceptedObservable<T>,
) => createObservable<T>(undefined as T, options);
