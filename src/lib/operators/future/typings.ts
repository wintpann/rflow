export type FutureIdle = {
  data: null;
  error: null;
  state: 'idle';
  _tag: 'future';
};

export type FuturePending<A> = {
  data: A | null;
  error: null;
  state: 'pending';
  _tag: 'future';
};

export type FutureSuccess<A> = {
  data: A;
  error: null;
  state: 'success';
  _tag: 'future';
};

export type FutureFailure<E = Error> = {
  data: null;
  error: E;
  state: 'failure';
  _tag: 'future';
};

export type Future<A, E = Error> =
  | FutureIdle
  | FuturePending<A>
  | FutureSuccess<A>
  | FutureFailure<E>;

export interface CombineFuture {
  <S extends Record<string, Future<any, any>>>(struct: S): Future<
    {
      [K in keyof S]: S[K] extends Future<infer R, any> ? R : never;
    },
    S extends Record<string, Future<any, infer R>> ? R : never
  >;

  <A, E>(a: Future<A, E>): Future<[A], E>;

  <A, B, E>(a: Future<A, E>, b: Future<B, E>): Future<[A, B], E>;

  <A, B, C, E>(a: Future<A, E>, b: Future<B, E>, c: Future<C, E>): Future<
    [A, B, C],
    E
  >;

  <A, B, C, D, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
  ): Future<[A, B, C, D], E>;

  <A, B, C, D, F, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
  ): Future<[A, B, C, D, F], E>;

  <A, B, C, D, F, G, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
  ): Future<[A, B, C, D, F, G], E>;

  <A, B, C, D, F, G, H, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
  ): Future<[A, B, C, D, F, G, H], E>;

  <A, B, C, D, F, G, H, I, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
    i: Future<I, E>,
  ): Future<[A, B, C, D, F, G, H, I], E>;

  <A, B, C, D, F, G, H, I, J, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
    i: Future<I, E>,
    j: Future<J, E>,
  ): Future<[A, B, C, D, F, G, H, I, J], E>;

  <A, B, C, D, F, G, H, I, J, K, E>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
    i: Future<I, E>,
    j: Future<J, E>,
    k: Future<K, E>,
  ): Future<[A, B, C, D, F, G, H, I, J, K], E>;
}

export interface MatchFuture {
  <A, B, E>(
    onSuccess: (a: A) => B,
    onFailure: (e: E) => B,
    onPending: (data: A | null) => B,
    onIdle: () => B,
  ): (future: Future<A, E>) => B;

  <A, B, E>(onHasData: (a: A) => B, onNoData: () => B): (
    future: Future<A, E>,
  ) => B;
}
