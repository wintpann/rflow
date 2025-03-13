// import {
//   Future,
//   FutureFailure,
//   FutureSuccess,
//   FutureIdle,
//   CombineFuture,
//   MatchFuture,
//   FuturePending,
// } from './typings.ts';
//
// const idle = <A, E = Error>(): Future<A, E> => ({
//   data: null,
//   error: null,
//   state: 'idle',
//   _tag: 'future',
// });
//
// const failure = <A, E = Error>(error: E): Future<A, E> => ({
//   error,
//   state: 'failure',
//   _tag: 'future',
//   data: null,
// });
//
// const success = <A, E = Error>(data: A): Future<A, E> => ({
//   error: null,
//   state: 'success',
//   _tag: 'future',
//   data,
// });
//
// const pending = <A, E = Error>(data?: A): Future<A, E> => ({
//   error: null,
//   state: 'pending',
//   _tag: 'future',
//   data: data ?? null,
// });
//
// const isFuture = <A, E = Error>(future: any): future is Future<A, E> =>
//   future?._tag === 'future';
//
// const isPending = <A, E = Error>(
//   future: Future<A, E>,
// ): future is FuturePending<A> => future.state === 'pending';
//
// const isSuccess = <A, E = Error>(
//   future: Future<A, E>,
// ): future is FutureSuccess<A> => future.state === 'success';
//
// const isIdle = <A, E = Error>(future: Future<A, E>): future is FutureIdle =>
//   future.state === 'idle';
//
// const isFailure = <A, E = Error>(
//   future: Future<A, E>,
// ): future is FutureFailure<E> => future.state === 'failure';
//
// const map =
//   <A, B, E>(f: (a: A) => B) =>
//   (future: Future<A, E>): Future<B, E> => {
//     if (isSuccess(future)) {
//       return success(f(future.data));
//     }
//
//     if (isPending(future) && future.data !== null) {
//       return pending(f(future.data));
//     }
//
//     return future as Future<B, E>;
//   };
//
// const mapLeft =
//   <E1, E2, A>(f: (e1: E1) => E2) =>
//   (future: Future<A, E1>): Future<A, E2> => {
//     if (isFailure(future)) {
//       return failure(f(future.error));
//     }
//
//     return future;
//   };
//
// const getOrElse =
//   <A, E>(onElse: () => A) =>
//   (future: Future<A, E>) => {
//     if (isSuccess(future)) {
//       return future.data;
//     }
//
//     if (isPending(future) && future.data !== null) {
//       return future.data;
//     }
//
//     return onElse();
//   };
//
// const toNullable = <A, E>(future: Future<A, E>): A | null =>
//   getOrElse<A | null, E>(() => null)(future);
//
// const match: MatchFuture =
//   <A, B, E = Error>(...args: any[]) =>
//   (data: Future<A, E>): B => {
//     if (args.length === 2) {
//       return data.data ? args[0](data.data) : args[1]();
//     }
//     if (isIdle(data)) return args[3]();
//     if (isFailure(data)) return args[1](data.error);
//     if (isSuccess(data)) return args[0](data.data);
//     return args[2](data.data);
//   };
//
// const sequence = (...list: Future<any, any>[]) => {
//   const everySuccess = list.every(isSuccess);
//   if (everySuccess) {
//     return success(list.map(({ data }) => data));
//   }
//
//   const failureEntry = list.find(isFailure);
//   if (failureEntry) {
//     return failure(failureEntry.error);
//   }
//
//   const pendingDataOrSuccess = list.every(
//     (future) =>
//       isSuccess(future) || (isPending(future) && future.data !== null),
//   );
//   if (pendingDataOrSuccess) {
//     return pending(list.map(({ data }) => data));
//   }
//
//   const pendingCount = list.filter(isPending).length;
//   if (pendingCount > 0) {
//     return pending();
//   }
//
//   return idle();
// };
//
// const combine = (struct: Record<string, Future<any, any>>) => {
//   const entries = Object.entries(struct);
//   const list = entries.map(([, el]) => el);
//
//   // @ts-ignore
//   const tupleSequence: Future<any, any> = sequence(...list);
//
//   if (isSuccess(tupleSequence)) {
//     const result: Record<string, any> = {};
//     entries.forEach(([key, el]) => {
//       result[key] = el.data;
//     });
//     return success(result);
//   }
//
//   if (isPending(tupleSequence) && tupleSequence.data !== null) {
//     const result: Record<string, any> = {};
//     entries.forEach(([key, el]) => {
//       result[key] = el.data;
//     });
//     return pending(result);
//   }
//
//   if (isPending(tupleSequence) || isFailure(tupleSequence))
//     return tupleSequence;
//
//   return idle();
// };
//
// const combineFuture: CombineFuture = ((...args: any[]) => {
//   return isFuture(args[0]) ? sequence(...args) : combine(args[0]);
// }) as CombineFuture;
//
// export const future = {
//   idle,
//   failure,
//   success,
//   pending,
//   isPending,
//   isSuccess,
//   isIdle,
//   isFailure,
//   map,
//   mapLeft,
//   getOrElse,
//   toNullable,
//   match,
//   combine: combineFuture,
// };
