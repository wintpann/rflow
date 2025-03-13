// import { Future } from './typings.ts';
// import { future } from './lib.ts';
//
// const MOCK = {
//   SUCCESS_VALUE: 1,
//   FAILURE_VALUE: 2,
//   PENDING_VALUE: 3,
//   ELSE_VALUE: 4,
// };
//
// const setup = () => {
//   const idle: Future<number, number> = future.idle();
//   const pending: Future<number, number> = future.pending();
//   const refreshing: Future<number, number> = future.pending(MOCK.PENDING_VALUE);
//   const failure: Future<number, number> = future.failure(MOCK.FAILURE_VALUE);
//   const success: Future<number, number> = future.success(MOCK.SUCCESS_VALUE);
//
//   return { idle, pending, refreshing, failure, success };
// };
//
// describe('future', () => {
//   it('should have correct idle factory', () => {
//     expect(future.idle()).toStrictEqual({
//       data: null,
//       state: 'idle',
//       _tag: 'future',
//       error: null,
//     });
//   });
//
//   it('should have correct pending factory', () => {
//     expect(future.pending()).toStrictEqual({
//       state: 'pending',
//       _tag: 'future',
//       error: null,
//       data: null,
//     });
//
//     expect(future.pending(MOCK.PENDING_VALUE)).toStrictEqual({
//       state: 'pending',
//       _tag: 'future',
//       error: null,
//       data: MOCK.PENDING_VALUE,
//     });
//   });
//
//   it('should have correct failure factory', () => {
//     expect(future.failure(MOCK.FAILURE_VALUE)).toStrictEqual({
//       state: 'failure',
//       _tag: 'future',
//       error: MOCK.FAILURE_VALUE,
//       data: null,
//     });
//   });
//
//   it('should have correct success factory', () => {
//     expect(future.success(MOCK.SUCCESS_VALUE)).toStrictEqual({
//       state: 'success',
//       _tag: 'future',
//       error: null,
//       data: MOCK.SUCCESS_VALUE,
//     });
//   });
//
//   it('should have correct type guards', () => {
//     const { idle, pending, failure, success } = setup();
//
//     expect(future.isIdle(idle)).toBe(true);
//     expect(future.isPending(pending)).toBe(true);
//     expect(future.isFailure(failure)).toBe(true);
//     expect(future.isSuccess(success)).toBe(true);
//
//     expect(future.isPending(idle)).toBe(false);
//     expect(future.isFailure(idle)).toBe(false);
//     expect(future.isSuccess(idle)).toBe(false);
//
//     expect(future.isIdle(pending)).toBe(false);
//     expect(future.isFailure(pending)).toBe(false);
//     expect(future.isSuccess(pending)).toBe(false);
//
//     expect(future.isIdle(failure)).toBe(false);
//     expect(future.isPending(failure)).toBe(false);
//     expect(future.isSuccess(failure)).toBe(false);
//
//     expect(future.isIdle(success)).toBe(false);
//     expect(future.isPending(success)).toBe(false);
//     expect(future.isFailure(success)).toBe(false);
//   });
//
//   it('should run map correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//     const map = future.map((a: number) => a * 2);
//
//     expect(map(idle)).toStrictEqual(future.idle());
//     expect(map(pending)).toStrictEqual(future.pending());
//     expect(map(failure)).toStrictEqual(future.failure(MOCK.FAILURE_VALUE));
//     expect(map(success)).toStrictEqual(future.success(MOCK.SUCCESS_VALUE * 2));
//     expect(map(refreshing)).toStrictEqual(
//       future.pending(MOCK.PENDING_VALUE * 2),
//     );
//   });
//
//   it('should run mapLeft correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//     const mapLeft = future.mapLeft((a: number) => a * 2);
//
//     expect(mapLeft(idle)).toStrictEqual(future.idle());
//     expect(mapLeft(pending)).toStrictEqual(future.pending());
//     expect(mapLeft(failure)).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE * 2),
//     );
//     expect(mapLeft(success)).toStrictEqual(future.success(MOCK.SUCCESS_VALUE));
//     expect(mapLeft(refreshing)).toStrictEqual(
//       future.pending(MOCK.PENDING_VALUE),
//     );
//   });
//
//   it('should run fold correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//     const fold = future.match(
//       () => 'success',
//       () => 'failure',
//       (data) => (data ? 'pending_with_data' : 'pending_with_no_data'),
//       () => 'initial',
//     );
//
//     expect(fold(idle)).toBe('initial');
//     expect(fold(pending)).toBe('pending_with_no_data');
//     expect(fold(refreshing)).toBe('pending_with_data');
//     expect(fold(failure)).toBe('failure');
//     expect(fold(success)).toBe('success');
//   });
//
//   it('should run getOrElse correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//     const orElse = future.getOrElse(() => MOCK.ELSE_VALUE);
//
//     expect(orElse(idle)).toBe(MOCK.ELSE_VALUE);
//     expect(orElse(pending)).toBe(MOCK.ELSE_VALUE);
//     expect(orElse(refreshing)).toBe(MOCK.PENDING_VALUE);
//     expect(orElse(failure)).toBe(MOCK.ELSE_VALUE);
//     expect(orElse(success)).toBe(MOCK.SUCCESS_VALUE);
//   });
//
//   it('should run toNullable correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//     expect(future.toNullable(idle)).toBe(null);
//     expect(future.toNullable(pending)).toBe(null);
//     expect(future.toNullable(refreshing)).toBe(MOCK.PENDING_VALUE);
//     expect(future.toNullable(failure)).toBe(null);
//     expect(future.toNullable(success)).toBe(MOCK.SUCCESS_VALUE);
//   });
//
//   it('should run sequence correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//
//     const sequenceSuccess = future.combine(success, success);
//     expect(sequenceSuccess).toStrictEqual(
//       future.success([MOCK.SUCCESS_VALUE, MOCK.SUCCESS_VALUE]),
//     );
//
//     const sequenceSuccessPendingWithData = future.combine(success, refreshing);
//     expect(sequenceSuccessPendingWithData).toStrictEqual(
//       future.pending([MOCK.SUCCESS_VALUE, MOCK.PENDING_VALUE]),
//     );
//
//     const sequenceSuccessPending = future.combine(success, pending);
//     expect(sequenceSuccessPending).toStrictEqual(future.pending());
//
//     const sequenceSuccessInitial = future.combine(success, idle);
//     expect(sequenceSuccessInitial).toStrictEqual(future.idle());
//
//     const sequenceSuccessFailure = future.combine(success, failure);
//     expect(sequenceSuccessFailure).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailurePending = future.combine(failure, pending);
//     expect(sequenceFailurePending).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailurePendingWithData = future.combine(failure, refreshing);
//     expect(sequenceFailurePendingWithData).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailureInitial = future.combine(failure, idle);
//     expect(sequenceFailureInitial).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailureFailure = future.combine(failure, failure);
//     expect(sequenceFailureFailure).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequencePendingInitial = future.combine(pending, idle);
//     expect(sequencePendingInitial).toStrictEqual(future.pending());
//
//     const sequencePendingWithDataInitial = future.combine(refreshing, idle);
//     expect(sequencePendingWithDataInitial).toStrictEqual(future.pending());
//
//     const sequenceInitialInitial = future.combine(idle, idle);
//     expect(sequenceInitialInitial).toStrictEqual(future.idle());
//   });
//
//   it('should run combine correctly', () => {
//     const { idle, pending, refreshing, failure, success } = setup();
//
//     const sequenceSuccess = future.combine({ one: success, two: success });
//     expect(sequenceSuccess).toStrictEqual(
//       future.success({ one: MOCK.SUCCESS_VALUE, two: MOCK.SUCCESS_VALUE }),
//     );
//
//     const sequenceSuccessPendingWithData = future.combine({
//       one: success,
//       two: refreshing,
//     });
//     expect(sequenceSuccessPendingWithData).toStrictEqual(
//       future.pending({
//         one: MOCK.SUCCESS_VALUE,
//         two: MOCK.PENDING_VALUE,
//       }),
//     );
//
//     const sequenceSuccessPending = future.combine({
//       one: success,
//       two: pending,
//     });
//     expect(sequenceSuccessPending).toStrictEqual(future.pending());
//
//     const sequenceSuccessInitial = future.combine({ one: success, two: idle });
//     expect(sequenceSuccessInitial).toStrictEqual(future.idle());
//
//     const sequenceSuccessFailure = future.combine({
//       one: success,
//       two: failure,
//     });
//     expect(sequenceSuccessFailure).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailurePending = future.combine({
//       one: failure,
//       two: pending,
//     });
//     expect(sequenceFailurePending).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailurePendingWithData = future.combine({
//       one: failure,
//       two: refreshing,
//     });
//     expect(sequenceFailurePendingWithData).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailureInitial = future.combine({ one: failure, two: idle });
//     expect(sequenceFailureInitial).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequenceFailureFailure = future.combine({
//       one: failure,
//       two: failure,
//     });
//     expect(sequenceFailureFailure).toStrictEqual(
//       future.failure(MOCK.FAILURE_VALUE),
//     );
//
//     const sequencePendingInitial = future.combine({ one: pending, two: idle });
//     expect(sequencePendingInitial).toStrictEqual(future.pending());
//
//     const sequencePendingWithDataInitial = future.combine({
//       one: refreshing,
//       two: idle,
//     });
//     expect(sequencePendingWithDataInitial).toStrictEqual(future.pending());
//
//     const sequenceInitialInitial = future.combine({ one: idle, two: idle });
//     expect(sequenceInitialInitial).toStrictEqual(future.idle());
//   });
//
//   it('should match base overload', () => {
//     const matchers = [
//       () => 'success',
//       () => 'failure',
//       () => 'pending',
//       () => 'idle',
//     ] as const;
//     expect(future.match(...matchers)(future.success(MOCK.SUCCESS_VALUE))).toBe(
//       'success',
//     );
//     expect(future.match(...matchers)(future.failure(MOCK.FAILURE_VALUE))).toBe(
//       'failure',
//     );
//     expect(future.match(...matchers)(future.pending(MOCK.PENDING_VALUE))).toBe(
//       'pending',
//     );
//     expect(future.match(...matchers)(future.pending())).toBe('pending');
//     expect(future.match(...matchers)(future.idle())).toBe('idle');
//   });
//
//   it('should match short overload', () => {
//     const matchers = [() => 'data', () => 'nodata'] as const;
//     expect(future.match(...matchers)(future.success(MOCK.SUCCESS_VALUE))).toBe(
//       'data',
//     );
//     expect(future.match(...matchers)(future.failure(MOCK.FAILURE_VALUE))).toBe(
//       'nodata',
//     );
//     expect(future.match(...matchers)(future.pending(MOCK.PENDING_VALUE))).toBe(
//       'data',
//     );
//     expect(future.match(...matchers)(future.pending())).toBe('nodata');
//     expect(future.match(...matchers)(future.idle())).toBe('nodata');
//   });
// });
