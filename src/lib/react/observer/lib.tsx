import {
  FC,
  createElement,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Observable, readTracker } from '../../observable';
import { Lazy } from '../../shared';

export const useUpdate = () => {
  const [, update] = useReducer((num) => (num + 1) % 1_000_000, 0);
  return update;
};

export function observer<Props extends object = object>(
  component: FC<Props>,
): FC<Props> {
  return (props: Props) => {
    const update = useUpdate();
    const deps = useRef(new Map<Observable, Lazy>());
    const untrack = readTracker.track();

    useEffect(() => {
      const tracked = untrack();

      for (const [observable, unsubscribe] of deps.current.entries()) {
        if (tracked.has(observable)) {
          tracked.delete(observable);
        } else {
          unsubscribe();
          deps.current.delete(observable);
        }
      }

      for (const observable of tracked.values()) {
        deps.current.set(observable, observable.observe(update));
      }
    });

    return createElement(component, props);
  };
}

export function useModel<T>(factory: Lazy<T>): T {
  // TODO do not track reads here
  const [model] = useState(factory);
  return model;
}
