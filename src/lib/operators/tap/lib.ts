import { Observable, operate } from '../../observable';

export const tap =
  <A>(fn: (a: A) => void) =>
  (source: Observable<A>): Observable<A> =>
    operate({
      destination: source,
      define: () => source.observeSync((value) => fn(value)),
    });
