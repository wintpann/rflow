import {
  action,
  getDebugName,
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  toJS,
} from 'mobx';

import { debug, die, pipe } from '../common/lib.ts';
import {
  CreateObservableOptions,
  Observable,
  ObservableController,
  ObservableState,
} from './typings.ts';
import { Lazy } from '../common/typings.ts';

export const createObservable = <T>(
  value: T,
  options?: CreateObservableOptions<T>,
): Observable<T> => {
  const state: ObservableState<T> = {
    deriver: options?.deriver,
    interceptor: options?.interceptor,
    shouldChain: options?.shouldChain ?? false,
    enabled: options?.enabled ?? true,
    observed: false,
    justCreated: true,
    get isDerivation() {
      return !!state.deriver || !!state.interceptor;
    },
  };

  const controller: ObservableController<T> = {
    derive: () => {
      if (state.deriver) {
        observable.$ = state.deriver();
      } else {
        die('No deriver set');
      }
    },
    chain: (prev: T) => {
      if (state.justCreated && state.shouldChain) {
        observable.$ = prev;
      }
    },
  };

  const observable = makeAutoObservable(
    {
      $: value,
      get value() {
        if (state.interceptor) {
          return state.interceptor();
        }

        if (state.deriver && !state.observed) {
          controller.derive();
        }

        return observable.$;
      },
      set value(value) {
        observable.$ = value;
      },
      get raw() {
        return toJS(observable.value);
      },
      // @ts-ignore
      pipe: (...fns: any) => pipe(observable, ...fns),
      next: (value) => {
        if (typeof value === 'function') {
          // @ts-ignore
          observable.$ = value(observable.$);
        } else {
          observable.$ = value;
        }
      },
    },
    { pipe: false, alter: false, next: action },
  ) as Observable<T>;

  const disposer: { dispose: Lazy | void } = {
    dispose: undefined,
  };

  onBecomeObserved(observable, 'value', () => {
    debug('observed', getDebugName(observable));
    state.observed = true;

    disposer.dispose = options?.onObserved?.(state, controller);
  });

  onBecomeUnobserved(observable, 'value', () => {
    debug('UNOBSERVED', getDebugName(observable));
    state.observed = false;

    disposer.dispose?.();
  });

  setTimeout(() => {
    state.justCreated = false;
  });

  return observable;
};
