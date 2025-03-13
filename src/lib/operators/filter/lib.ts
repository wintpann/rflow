import { observable, Observable, operate } from '../../observable';

export const filter =
  <T>(predicate: (value: T) => boolean) =>
  (source: Observable<T>): Observable<T | null> => {
    const initial = source();

    return operate({
      destination: observable(predicate(initial) ? initial : null).api(),
      define: ({ next }) =>
        source.observeSync((value) => {
          if (predicate(value)) {
            next(value);
          }
        }),
    });
  };
