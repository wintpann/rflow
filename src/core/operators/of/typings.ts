import { Observable, ObservedHandler } from '../../observable/typings.ts';

export interface Of {
  <T>(
    initial: T,
    onObserved?: ObservedHandler,
  ): Observable<T>;
}
