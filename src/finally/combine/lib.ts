import { observable, Observable, reflect } from '../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (...items: any[]): Observable<any> => {
  const isStruct = typeof items[0] === 'object' && items[0] !== null;
  const observables = isStruct
    ? (Object.values(items[0]) as Observable<any>[])
    : (items as Observable<any>[]);

  const value = () =>
    isStruct
      ? Object.entries<Observable<any>>(items[0]).reduce(
          (acc, [key, observable]) => ({
            ...acc,
            [key]: observable(),
          }),
          {},
        )
      : observables.map((observable) => observable());

  return observable(value()).create({
    reflect: {
      parent: observables,
      onRead: ({ isObserved, next }) => {
        const hasUpdates = observables.some((observable) =>
          reflect(observable).hasScheduledUpdate(),
        );
        if (!isObserved() || hasUpdates) {
          next(value(), { scheduleUpdate: false });
        }
      },
      onBecomesObserved: ({ next }) => {
        next(value(), { scheduleUpdate: false });
        const unobservers = observables.map((observable) =>
          observable.observe(() => next(value())),
        );
        return () => {
          for (const unobserve of unobservers) {
            unobserve();
          }
        };
      },
    },
  });
};
