import { Observable } from '../observable';

export interface Combine {
  <A>(a: Observable<A>): Observable<[A]>;
  <A, Result>(a: Observable<A>, project: (a: A) => Result): Observable<Result>;

  <A, B>(a: Observable<A>, b: Observable<B>): Observable<[A, B]>;
  <A, B, Result>(
    a: Observable<A>,
    b: Observable<B>,
    project: (a: A, b: B) => Result,
  ): Observable<Result>;

  <A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<
    [A, B, C]
  >;
  <A, B, C, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    project: (a: A, b: B, c: C) => Result,
  ): Observable<Result>;

  <A, B, C, D>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
  ): Observable<[A, B, C, D]>;
  <A, B, C, D, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    project: (a: A, b: B, c: C, d: D) => Result,
  ): Observable<Result>;

  <A, B, C, D, F>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
  ): Observable<[A, B, C, D, F]>;
  <A, B, C, D, F, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    project: (a: A, b: B, c: C, d: D, f: F) => Result,
  ): Observable<Result>;

  <A, B, C, D, F, G>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
  ): Observable<[A, B, C, D, F, G]>;
  <A, B, C, D, F, G, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    project: (a: A, b: B, c: C, d: D, f: F, g: G) => Result,
  ): Observable<Result>;

  <A, B, C, D, F, G, H>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
  ): Observable<[A, B, C, D, F, G, H]>;
  <A, B, C, D, F, G, H, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    project: (a: A, b: B, c: C, d: D, f: F, g: G, h: H) => Result,
  ): Observable<Result>;

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
  <A, B, C, D, F, G, H, I, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    i: Observable<I>,
    project: (a: A, b: B, c: C, d: D, f: F, g: G, h: H, i: I) => Result,
  ): Observable<Result>;

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
  <A, B, C, D, F, G, H, I, J, Result>(
    a: Observable<A>,
    b: Observable<B>,
    c: Observable<C>,
    d: Observable<D>,
    f: Observable<F>,
    g: Observable<G>,
    h: Observable<H>,
    i: Observable<I>,
    j: Observable<J>,
    project: (a: A, b: B, c: C, d: D, f: F, g: G, h: H, i: I, j: J) => Result,
  ): Observable<Result>;

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
  <A, B, C, D, F, G, H, I, J, K, Result>(
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
    project: (
      a: A,
      b: B,
      c: C,
      d: D,
      f: F,
      g: G,
      h: H,
      i: I,
      j: J,
      k: K,
    ) => Result,
  ): Observable<Result>;
}
