import { Observable } from '../observable/lib.ts';

export interface Interval {
  (
    delay: number,
    options?: { from?: number; immediateIncrement?: boolean; step?: number },
  ): Observable<number>;
}
