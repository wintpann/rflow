import { createObservable, isObservable, Observable } from '../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...items: Function[]
): Observable<any> => {
  const observables = items.filter(isObservable);
  const lastItem = items[items.length - 1];
  const project = isObservable(lastItem) ? undefined : lastItem;

  let observed = false;

  const value = () => {
    const observableValues = observables.map((observable) => observable());
    return project ? project(observableValues) : observableValues;
  };

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
