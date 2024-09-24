import { observable, Observable, operate } from '../observable';

export const scan =
  <T, K>(callback: (accumulator: K, value: T) => K, seed: K) =>
  (source: Observable<T>): Observable<K> =>
    operate({
      destination: observable(callback(seed, source())).create(),
      define: ({ next, self }) =>
        source._unsafe.watch((curr) => next(callback(self(), curr))),
    });
