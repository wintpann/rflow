import { DependencyList, EffectCallback, useEffect } from 'react';

export const useEffectOnce = (effect: EffectCallback, deps: DependencyList) => {
  useEffect(() => {
    let ignore = false;
    let destructor: (() => void) | void;

    Promise.resolve().then(() => {
      if (!ignore) {
        destructor = effect();
      }
    });

    return () => {
      ignore = true;
      if (destructor) {
        destructor();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
