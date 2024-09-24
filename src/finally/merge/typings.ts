import { Observable } from '../observable';

export interface Merge {
  <A>(a: Observable<A, NonNullable<unknown>>): Observable<A>;

  <A, B>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
  ): Observable<A | B>;

  <A, B, C>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
  ): Observable<A | B | C>;

  <A, B, C, D>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
  ): Observable<A | B | C | D>;

  <A, B, C, D, F>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F>;

  <A, B, C, D, F, G>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
    g: Observable<G, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F | G>;

  <A, B, C, D, F, G, H>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
    g: Observable<G, NonNullable<unknown>>,
    h: Observable<H, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F | G | H>;

  <A, B, C, D, F, G, H, I>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
    g: Observable<G, NonNullable<unknown>>,
    h: Observable<H, NonNullable<unknown>>,
    i: Observable<I, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F | G | H | I>;

  <A, B, C, D, F, G, H, I, J>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
    g: Observable<G, NonNullable<unknown>>,
    h: Observable<H, NonNullable<unknown>>,
    i: Observable<I, NonNullable<unknown>>,
    j: Observable<J, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F | G | H | I | J>;

  <A, B, C, D, F, G, H, I, J, K>(
    a: Observable<A, NonNullable<unknown>>,
    b: Observable<B, NonNullable<unknown>>,
    c: Observable<C, NonNullable<unknown>>,
    d: Observable<D, NonNullable<unknown>>,
    f: Observable<F, NonNullable<unknown>>,
    g: Observable<G, NonNullable<unknown>>,
    h: Observable<H, NonNullable<unknown>>,
    i: Observable<I, NonNullable<unknown>>,
    j: Observable<J, NonNullable<unknown>>,
    k: Observable<K, NonNullable<unknown>>,
  ): Observable<A | B | C | D | F | G | H | I | J | K>;
}
