import { createObservable, Observable } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (observable: Observable<A>): Observable<B> => {
    const value = { current: null as B };
    let initialized = false;
    let subscribersCount = 0;

    return createObservable(() => ({
      value,
      onReadValue: () => {
        if (subscribersCount === 0 || !initialized) {
          value.current = fn(observable());
          initialized = true;
        }
      },
      onNotifyValue: () => {
        value.current = fn(observable());
      },
      onSubscribed: () => {
        subscribersCount++;

        return () => {
          subscribersCount--;
        };
      },
    }));
  };
