import { observable, Observable, operate } from '../../observable';
import { debounce, DebounceSettings } from 'lodash-es';

export const debounceTime =
  <A>(time: number, options?: DebounceSettings) =>
  (source: Observable<A>): Observable<A> =>
    operate({
      destination: observable(source()).create(),
      define: ({ next }) =>
        source._unsafe.watch(debounce((value) => next(value), time, options)),
    });
