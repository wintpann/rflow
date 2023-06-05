import { Observable } from '../observable/lib.ts';

type NonEmptyArray2<T> = [T, T, ...T[]];

export interface Merge {
  <A>(...observables: NonEmptyArray2<Observable<A>>): Observable<A>;
}
