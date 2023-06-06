import {
  Future,
  FutureChain,
  FutureCombine,
  FutureFailure,
  FutureFold,
  FutureGetOrElse,
  FutureIdle,
  FutureMap,
  FutureMapLeft,
  FuturePending,
  FutureSequence,
  FutureSuccess,
  FutureToNullable,
} from './typings.ts';

const idle = <A, E = Error>(): Future<A, E> => ({
  data: null,
  error: null,
  state: 'idle',
});

const failure = <A, E = Error>(error: E): Future<A, E> => ({
  error,
  state: 'failure',
  data: null,
});

const of = <A, E = Error>(data: A): Future<A, E> => ({
  error: null,
  state: 'success',
  data,
});

const pending = <A, E = Error>(data?: A): Future<A, E> => ({
  error: null,
  state: 'pending',
  data: data ?? null,
});

const isPending = <A, E = Error>(
  future: Future<A, E>,
): future is FuturePending<A> => future.state === 'pending';

const isSuccess = <A, E = Error>(
  future: Future<A, E>,
): future is FutureSuccess<A> => future.state === 'success';

const isIdle = <A, E = Error>(future: Future<A, E>): future is FutureIdle =>
  future.state === 'idle';

const isFailure = <A, E = Error>(
  future: Future<A, E>,
): future is FutureFailure<E> => future.state === 'failure';

const map: FutureMap =
  <A, B, E = Error>(f: (a: A) => B) =>
  (future: Future<A, E>): Future<B, E> => {
    if (isSuccess(future)) {
      return of(f(future.data));
    }

    if (isPending(future) && future.data !== null) {
      return pending(f(future.data));
    }

    return future as Future<B, E>;
  };

const mapLeft: FutureMapLeft =
  <E1, E2, A>(f: (e1: E1) => E2) =>
  (future: Future<A, E1>): Future<A, E2> => {
    if (isFailure(future)) {
      return failure(f(future.error));
    }

    return future;
  };

const getOrElse: FutureGetOrElse =
  <A, E>(onElse: () => A) =>
  (future: Future<A, E>) => {
    if (isSuccess(future)) {
      return future.data;
    }

    if (isPending(future) && future.data !== null) {
      return future.data;
    }

    return onElse();
  };

const toNullable: FutureToNullable = <A, E>(future: Future<A, E>): A | null =>
  getOrElse<A | null, E>(() => null)(future);

const chain: FutureChain =
  <A, B, E = Error>(f: (a: A) => Future<B, E>) =>
  (future: Future<A, E>): Future<B, E> => {
    if (isSuccess(future)) {
      return f(future.data);
    }
    if (isPending(future) && future.data !== null) {
      return f(future.data);
    }
    return future as Future<B, E>;
  };

const sequence = ((...list: Future<any, any>[]) => {
  const everySuccess = list.every(isSuccess);
  if (everySuccess) {
    return of(list.map(({ data }) => data));
  }

  const failureEntry = list.find(isFailure);
  if (failureEntry) {
    return failure(failureEntry.error);
  }

  const pendingDataOrSuccess = list.every(
    (future) =>
      isSuccess(future) || (isPending(future) && future.data !== null),
  );
  if (pendingDataOrSuccess) {
    return pending(list.map(({ data }) => data));
  }

  const pendingCount = list.filter(isPending).length;
  if (pendingCount > 0) {
    return pending();
  }

  return idle();
}) as FutureSequence;

const combine = ((struct: Record<string, Future<any, any>>) => {
  const entries = Object.entries(struct);
  const list = entries.map(([, el]) => el);

  // @ts-ignore
  const tupleSequence: Future<any, any> = sequence(...list);

  if (isSuccess(tupleSequence)) {
    const result: Record<string, any> = {};
    entries.forEach(([key, el]) => {
      result[key] = el.data;
    });
    return of(result);
  }

  if (isPending(tupleSequence) && tupleSequence.data !== null) {
    const result: Record<string, any> = {};
    entries.forEach(([key, el]) => {
      result[key] = el.data;
    });
    return pending(result);
  }

  if (isPending(tupleSequence) || isFailure(tupleSequence))
    return tupleSequence;

  return idle();
}) as FutureCombine;

const fold: FutureFold =
  <A, B, E = Error>(
    onInitial: () => B,
    onPending: (data: A | null) => B,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ) =>
  (data: Future<A, E>): B => {
    if (isIdle(data)) return onInitial();
    if (isFailure(data)) return onFailure(data.error);
    if (isSuccess(data)) return onSuccess(data.data);
    return onPending(data.data);
  };

export const future = {
  idle,
  failure,
  of,
  pending,
  isPending,
  isSuccess,
  isIdle,
  isFailure,
  map,
  mapLeft,
  getOrElse,
  toNullable,
  chain,
  sequence,
  combine,
  fold,
};
