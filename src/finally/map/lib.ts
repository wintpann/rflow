import { observable, Observable } from '../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (source: Observable<A>): Observable<B> =>
    observable(fn(source())).create(null, ({ next }) =>
      source._unsafe.watch((value) => next(fn(value))),
    );
