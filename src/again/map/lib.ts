import { createObservable, Observable } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (observable: Observable<A>): Observable<B> => {
    let observed = false;
    const value = () => fn(observable());

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
          const unobserve = observable.observe(() => {
            setValue(value());
            notifyObservers();
          });

          return () => {
            observed = false;
            unobserve();
          };
        },
      }),
    );
  };
