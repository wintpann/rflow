import { Observable } from '../observable/typings.ts';

export interface Map {
  <A, B>(fn: (value: A) => B): (source: Observable<A>) => Observable<B>;
}
