import { observable, Observable, operate } from '../../observable';

export const filter =
  <T>(predicate: (value: T) => boolean) =>
  (source: Observable<T>): Observable<T | null> => {
    const initial = source();

    return operate({
      destination: observable(predicate(initial) ? initial : null).create(),
      define: ({ next }) =>
        source._unsafe.watch((value) => {
          if (predicate(value)) {
            next(value);
          }
        }),
    });
  };
