import { Future } from './typings.ts';
import { future } from './lib.ts';

const MOCK = {
  SUCCESS_VALUE: 1,
  FAILURE_VALUE: 2,
  PENDING_VALUE: 3,
  ELSE_VALUE: 4,
};

const setup = () => {
  const idle: Future<number, number> = future.idle();
  const pending: Future<number, number> = future.pending();
  const refreshing: Future<number, number> = future.pending(MOCK.PENDING_VALUE);
  const failure: Future<number, number> = future.failure(MOCK.FAILURE_VALUE);
  const success: Future<number, number> = future.of(MOCK.SUCCESS_VALUE);

  return { idle, pending, refreshing, failure, success };
};

describe('future', () => {
  it('should have correct idle factory', () => {
    expect(future.idle()).toStrictEqual({
      data: undefined,
      state: 'idle',
      error: undefined,
    });
  });

  it('should have correct pending factory', () => {
    expect(future.pending()).toStrictEqual({
      state: 'pending',
      error: undefined,
      data: undefined,
    });

    expect(future.pending(MOCK.PENDING_VALUE)).toStrictEqual({
      state: 'pending',
      error: undefined,
      data: MOCK.PENDING_VALUE,
    });
  });

  it('should have correct failure factory', () => {
    expect(future.failure(MOCK.FAILURE_VALUE)).toStrictEqual({
      state: 'failure',
      error: MOCK.FAILURE_VALUE,
      data: undefined,
    });
  });

  it('should have correct success factory', () => {
    expect(future.of(MOCK.SUCCESS_VALUE)).toStrictEqual({
      state: 'success',
      error: undefined,
      data: MOCK.SUCCESS_VALUE,
    });
  });

  it('should have correct type guards', () => {
    const { idle, pending, failure, success } = setup();

    expect(future.isIdle(idle)).toBe(true);
    expect(future.isPending(pending)).toBe(true);
    expect(future.isFailure(failure)).toBe(true);
    expect(future.isSuccess(success)).toBe(true);

    expect(future.isPending(idle)).toBe(false);
    expect(future.isFailure(idle)).toBe(false);
    expect(future.isSuccess(idle)).toBe(false);

    expect(future.isIdle(pending)).toBe(false);
    expect(future.isFailure(pending)).toBe(false);
    expect(future.isSuccess(pending)).toBe(false);

    expect(future.isIdle(failure)).toBe(false);
    expect(future.isPending(failure)).toBe(false);
    expect(future.isSuccess(failure)).toBe(false);

    expect(future.isIdle(success)).toBe(false);
    expect(future.isPending(success)).toBe(false);
    expect(future.isFailure(success)).toBe(false);
  });

  it('should run map correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();
    const map = future.map((a: number) => a * 2);

    expect(map(idle)).toStrictEqual(future.idle());
    expect(map(pending)).toStrictEqual(future.pending());
    expect(map(failure)).toStrictEqual(future.failure(MOCK.FAILURE_VALUE));
    expect(map(success)).toStrictEqual(future.of(MOCK.SUCCESS_VALUE * 2));
    expect(map(refreshing)).toStrictEqual(
      future.pending(MOCK.PENDING_VALUE * 2),
    );
  });

  it('should run fold correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();
    const fold = future.fold(
      () => 'initial',
      (data) => (data ? 'pending_with_data' : 'pending_with_no_data'),
      () => 'failure',
      () => 'success',
    );

    expect(fold(idle)).toBe('initial');
    expect(fold(pending)).toBe('pending_with_no_data');
    expect(fold(refreshing)).toBe('pending_with_data');
    expect(fold(failure)).toBe('failure');
    expect(fold(success)).toBe('success');
  });

  it('should run getOrElse correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();
    const orElse = future.getOrElse(() => MOCK.ELSE_VALUE);

    expect(orElse(idle)).toBe(MOCK.ELSE_VALUE);
    expect(orElse(pending)).toBe(MOCK.ELSE_VALUE);
    expect(orElse(refreshing)).toBe(MOCK.PENDING_VALUE);
    expect(orElse(failure)).toBe(MOCK.ELSE_VALUE);
    expect(orElse(success)).toBe(MOCK.SUCCESS_VALUE);
  });

  it('should run toNullable correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();
    expect(future.toNullable(idle)).toBe(null);
    expect(future.toNullable(pending)).toBe(null);
    expect(future.toNullable(refreshing)).toBe(MOCK.PENDING_VALUE);
    expect(future.toNullable(failure)).toBe(null);
    expect(future.toNullable(success)).toBe(MOCK.SUCCESS_VALUE);
  });

  it('should run chain correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();

    const chain = future.chain<number, number, number>((a: number) =>
      future.of(a * 2),
    );

    expect(chain(idle)).toStrictEqual(future.idle());
    expect(chain(pending)).toStrictEqual(future.pending());
    expect(chain(refreshing)).toStrictEqual(future.of(MOCK.PENDING_VALUE * 2));
    expect(chain(failure)).toStrictEqual(future.failure(MOCK.FAILURE_VALUE));
    expect(chain(success)).toStrictEqual(future.of(MOCK.SUCCESS_VALUE * 2));
  });

  it('should run sequence correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();

    const sequenceSuccess = future.sequence(success, success);
    expect(sequenceSuccess).toStrictEqual(
      future.of([MOCK.SUCCESS_VALUE, MOCK.SUCCESS_VALUE]),
    );

    const sequenceSuccessPendingWithData = future.sequence(success, refreshing);
    expect(sequenceSuccessPendingWithData).toStrictEqual(
      future.pending([MOCK.SUCCESS_VALUE, MOCK.PENDING_VALUE]),
    );

    const sequenceSuccessPending = future.sequence(success, pending);
    expect(sequenceSuccessPending).toStrictEqual(future.pending());

    const sequenceSuccessInitial = future.sequence(success, idle);
    expect(sequenceSuccessInitial).toStrictEqual(future.idle());

    const sequenceSuccessFailure = future.sequence(success, failure);
    expect(sequenceSuccessFailure).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailurePending = future.sequence(failure, pending);
    expect(sequenceFailurePending).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailurePendingWithData = future.sequence(failure, refreshing);
    expect(sequenceFailurePendingWithData).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailureInitial = future.sequence(failure, idle);
    expect(sequenceFailureInitial).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailureFailure = future.sequence(failure, failure);
    expect(sequenceFailureFailure).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequencePendingInitial = future.sequence(pending, idle);
    expect(sequencePendingInitial).toStrictEqual(future.pending());

    const sequencePendingWithDataInitial = future.sequence(refreshing, idle);
    expect(sequencePendingWithDataInitial).toStrictEqual(future.pending());

    const sequenceInitialInitial = future.sequence(idle, idle);
    expect(sequenceInitialInitial).toStrictEqual(future.idle());
  });

  it('should run combine correctly', () => {
    const { idle, pending, refreshing, failure, success } = setup();

    const sequenceSuccess = future.combine({ one: success, two: success });
    expect(sequenceSuccess).toStrictEqual(
      future.of({ one: MOCK.SUCCESS_VALUE, two: MOCK.SUCCESS_VALUE }),
    );

    const sequenceSuccessPendingWithData = future.combine({
      one: success,
      two: refreshing,
    });
    expect(sequenceSuccessPendingWithData).toStrictEqual(
      future.pending({
        one: MOCK.SUCCESS_VALUE,
        two: MOCK.PENDING_VALUE,
      }),
    );

    const sequenceSuccessPending = future.combine({
      one: success,
      two: pending,
    });
    expect(sequenceSuccessPending).toStrictEqual(future.pending());

    const sequenceSuccessInitial = future.combine({ one: success, two: idle });
    expect(sequenceSuccessInitial).toStrictEqual(future.idle());

    const sequenceSuccessFailure = future.combine({
      one: success,
      two: failure,
    });
    expect(sequenceSuccessFailure).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailurePending = future.combine({
      one: failure,
      two: pending,
    });
    expect(sequenceFailurePending).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailurePendingWithData = future.combine({
      one: failure,
      two: refreshing,
    });
    expect(sequenceFailurePendingWithData).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailureInitial = future.combine({ one: failure, two: idle });
    expect(sequenceFailureInitial).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequenceFailureFailure = future.combine({
      one: failure,
      two: failure,
    });
    expect(sequenceFailureFailure).toStrictEqual(
      future.failure(MOCK.FAILURE_VALUE),
    );

    const sequencePendingInitial = future.combine({ one: pending, two: idle });
    expect(sequencePendingInitial).toStrictEqual(future.pending());

    const sequencePendingWithDataInitial = future.combine({
      one: refreshing,
      two: idle,
    });
    expect(sequencePendingWithDataInitial).toStrictEqual(future.pending());

    const sequenceInitialInitial = future.combine({ one: idle, two: idle });
    expect(sequenceInitialInitial).toStrictEqual(future.idle());
  });
});
