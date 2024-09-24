import { observable, Observable } from '../observable';
import { debounce, DebounceSettings } from 'lodash-es';

export const debounceTime =
  <A>(time: number, options?: DebounceSettings) =>
  (source: Observable<A>): Observable<A> =>
    observable(source()).create(null, ({ next }) =>
      source._unsafe.watch(debounce((value) => next(value), time, options)),
    );
