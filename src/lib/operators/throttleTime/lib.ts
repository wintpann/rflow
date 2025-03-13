import { observable, Observable, operate } from '../../observable';
import { throttle, ThrottleSettings } from 'lodash-es';

export const throttleTime =
  <A>(time: number, options?: ThrottleSettings) =>
  (source: Observable<A>): Observable<A> =>
    operate({
      destination: observable(source()).api(),
      define: ({ next }) =>
        source.observeSync(throttle((value) => next(value), time, options)),
    });
