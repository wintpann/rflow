import { Observable } from '../observable';

export interface Combine {
  <A>(a: Observable<A>): Observable<[A]>;

  <A, B>(a: Observable<A>, b: Observable<B>): Observable<[A, B]>;

  <A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<
    [A, B, C]
  >;

  <A, B, C, D>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
  ): Observable<[A, B, C, D]>;

  <A, B, C, D, F>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
  ): Observable<[A, B, C, D, F]>;

  <A, B, C, D, F, G>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
  ): Observable<[A, B, C, D, F, G]>;

  <A, B, C, D, F, G, H>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
  ): Observable<[A, B, C, D, F, G, H]>;

  <A, B, C, D, F, G, H, I>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    i: Observable<I>,
  ): Observable<[A, B, C, D, F, G, H, I]>;

  <A, B, C, D, F, G, H, I, J>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    i: Observable<I>,
    j: Observable<J>,
  ): Observable<[A, B, C, D, F, G, H, I, J]>;

  <A, B, C, D, F, G, H, I, J, K>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    i: Observable<I>,
    j: Observable<J>,
    k: Observable<K>,
  ): Observable<[A, B, C, D, F, G, H, I, J, K]>;
}
