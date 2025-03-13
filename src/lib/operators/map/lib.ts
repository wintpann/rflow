import { observable, Observable, operate } from '../../observable';

export const map =
  <A, B>(fn: (a: A) => B) =>
  (source: Observable<A>): Observable<B> =>
    operate({
      destination: observable(fn(source())).api(),
      define: ({ next }) => source.observeSync((value) => next(fn(value))),
    });

export const mapTo = <T>(value: T) => map(() => value);
