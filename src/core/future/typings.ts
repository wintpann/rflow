export type FutureIdle = { data: undefined; error: undefined; state: 'idle' };

export type FuturePending<A> = {
  data: A | undefined;
  error: undefined;
  state: 'pending';
};

export type FutureSuccess<A> = { data: A; error: undefined; state: 'success' };

export type FutureFailure<E = Error> = {
  data: undefined;
  error: E;
  state: 'failure';
};

export type Future<A, E = Error> =
  | FutureIdle
  | FuturePending<A>
  | FutureSuccess<A>
  | FutureFailure<E>;

export interface FutureMap {
  <A, B, E = Error>(f: (a: A) => B): (future: Future<A, E>) => Future<B, E>;
}

export interface FutureMapLeft {
  <E1, E2, A>(f: (e1: E1) => E2): (future: Future<A, E1>) => Future<A, E2>;
}

export interface FutureGetOrElse {
  <A>(onElse: () => A): (future: Future<A>) => A;
}

export interface FutureToNullable {
  <A>(future: Future<A>): A | null;
}

export interface FutureChain {
  <A, B, E = Error>(f: (a: A) => Future<B, E>): (
    future: Future<A, E>,
  ) => Future<B, E>;
}

export interface FutureSequence {
  <A, E = Error>(a: Future<A, E>): Future<[A], E>;

  <A, B, E = Error>(a: Future<A, E>, b: Future<B, E>): Future<[A, B], E>;

  <A, B, C, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
  ): Future<[A, B, C], E>;

  <A, B, C, D, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
  ): Future<[A, B, C, D], E>;

  <A, B, C, D, F, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
  ): Future<[A, B, C, D, F], E>;

  <A, B, C, D, F, G, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
  ): Future<[A, B, C, D, F, G], E>;

  <A, B, C, D, F, G, H, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
  ): Future<[A, B, C, D, F, G, H], E>;

  <A, B, C, D, F, G, H, I, E = Error>(
    a: Future<A, E>,
    b: Future<B, E>,
    c: Future<C, E>,
    d: Future<D, E>,
    f: Future<F, E>,
    g: Future<G, E>,
    h: Future<H, E>,
    i: Future<I, E>,
  ): Future<[A, B, C, D, F, G, H, I], E>;

  <A, B, C, D, F, G, H, I, J, E = Error>(
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

  <A, B, C, D, F, G, H, I, J, K, E = Error>(
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

export interface FutureCombine {
  <S extends Record<string, Future<any, any>>>(struct: S): Future<
    {
      [K in keyof S]: S[K] extends Future<infer R, any> ? R : never;
    },
    S extends Record<string, Future<any, infer R>> ? R : never
  >;
}

export interface FutureFold {
  <A, B, E = Error>(
    onInitial: () => B,
    onPending: (data: A | undefined) => B,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (future: Future<A, E>) => B;
}
