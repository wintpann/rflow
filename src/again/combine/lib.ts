import { createObservable, Observable } from '../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (
  ...observables: Observable<any>[]
): Observable<any> => {
  const value = { current: null as any };
  let initialized = false;

  return createObservable((controller) => ({
    value,
    onReadValue: () => {
      if (!initialized) {
        value.current = observables.map((observable) => observable());
        initialized = true;
      }
    },
    onNotifyValue: () => {
      value.current = observables.map((observable) => observable());
    },
    onSubscribed: () => {
      const subscriber = () => controller.notifySubscribers();
      const unsubscribes = observables.map((observable) =>
        observable.subscribe(subscriber),
      );
      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe();
        }
      };
    },
  }));
};
