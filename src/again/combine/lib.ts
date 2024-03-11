import { createObservable, Observable } from '../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...items: any[]
): Observable<any> => {
  const isStruct = typeof items[0] === 'object' && items[0] !== null;
  const observables = isStruct
    ? (Object.values(items[0]) as Observable<any>[])
    : (items as Observable<any>[]);
  let observed = false;

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

  return createObservable(
    value(),
    ({ setValue, notifyObservers, hasScheduledUpdates }) => ({
      onReadValue: () => {
        if (!observed || hasScheduledUpdates()) {
          setValue(value());
        }
      },
      onBecomesObserved: () => {
        observed = true;
        const unobservers = observables.map((observable) =>
          observable.observe(() => {
            setValue(value());
            notifyObservers();
          }),
        );

        return () => {
          observed = false;
          for (const unobserve of unobservers) {
            unobserve();
          }
        };
      },
    }),
  );
};
