import { observable, Observable, operate } from '../observable';
import { throttle, ThrottleSettings } from 'lodash-es';

export const throttleTime =
  <A>(time: number, options?: ThrottleSettings) =>
  (source: Observable<A>): Observable<A> =>
    operate({
      destination: observable(source()).create(),
      define: ({ next }) =>
        source._unsafe.watch(throttle((value) => next(value), time, options)),
    });
