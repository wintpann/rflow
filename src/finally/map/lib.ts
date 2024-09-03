import { observable, Observable, introspect } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (source: Observable<A>): Observable<B> => {
    const value = () => fn(source());

    return observable(value()).create({
      reflect: {
        parent: source,
        onRead: ({ next, isObserved }) => {
          if (!isObserved() || introspect.hasUpdates(source)) {
            next(value(), { scheduleUpdate: false });
          }
        },
        onBecomesObserved: ({ next }) => {
          next(value(), { scheduleUpdate: false });
          return source.observe((v) => next(fn(v)));
        },
      },
    });
  };
