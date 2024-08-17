import { observable, Observable } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (source: Observable<A>): Observable<B> => {
    const value = () => fn(source());

    return observable(value()).create({
      reflect: {
        onRead: ({ next, isObserved }) => {
          if (!isObserved()) {
            next(value());
          }
        },
        onBecomesObserved: ({ next }) => source.observe(() => next(value())),
      },
    });
  };
