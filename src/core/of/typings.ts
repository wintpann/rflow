import { UnobservedHandler } from '../observable/typings.ts';
import { Observable } from '../observable/lib.ts';

export interface Of {
  <T>(
    initial: T,
    onObserved?: (self: Observable<T>) => UnobservedHandler | void,
  ): Observable<T>;
}
