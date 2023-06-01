import { Observable } from '../observable/typings.ts';

export interface Interval {
  (
    delay: number,
    options?: { from?: number; immediateIncrement?: boolean; step?: number },
  ): Observable<number>;
}
