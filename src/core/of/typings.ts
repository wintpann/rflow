import { ObservedHandler } from '../observable/typings.ts';
import { Observable } from '../observable/lib.ts';

export interface Of {
  <T>(initial: T, onObserved?: ObservedHandler): Observable<T>;
}
