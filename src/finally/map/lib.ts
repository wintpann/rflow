import { observable, Observable, reflect } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (source: Observable<A>): Observable<B> => {
    const value = () => fn(source());

    return observable(value()).create({
      reflect: {
        onRead: ({ next, isObserved }) => {
          if (!isObserved() || reflect(source).hasScheduledUpdate()) {
            next(value(), { scheduleUpdate: false });
          }
        },
        onBecomesObserved: ({ next }) => source.observe(() => next(value())),
      },
    });
  };
