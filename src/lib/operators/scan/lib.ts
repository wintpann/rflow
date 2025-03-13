import { observable, Observable, operate } from '../../observable';

export const scan =
  <T, K>(callback: (accumulator: K, value: T) => K, seed: K) =>
  (source: Observable<T>): Observable<K> =>
    operate({
      destination: observable(callback(seed, source())).api(),
      define: ({ next, self }) =>
        source.observeSync((curr) => next(callback(self(), curr))),
    });
