import { Observable } from '../observable/lib.ts';

export interface Map {
  <A, B>(fn: (value: A) => B): (source: Observable<A>) => Observable<B>;
}
