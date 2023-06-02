import { Observable } from '../observable/lib.ts';

export interface From {
  <A>(input: Iterable<A>, delay: number): Observable<A>;

  <A>(input: AsyncIterable<A>, initial: A): Observable<A>;

  <A>(input: Observable<A>): Observable<A>;
}
