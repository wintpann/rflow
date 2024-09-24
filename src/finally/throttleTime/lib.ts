import { observable, Observable } from '../observable';
import { throttle, ThrottleSettings } from 'lodash-es';

export const throttleTime =
  <A>(time: number, options?: ThrottleSettings) =>
  (source: Observable<A>): Observable<A> =>
    observable(source()).create(null, ({ next }) =>
      source._unsafe.watch(throttle((value) => next(value), time, options)),
    );
