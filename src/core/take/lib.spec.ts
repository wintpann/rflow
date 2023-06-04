import { take } from './lib.ts';
import { of } from '../of/lib.ts';
import { readEffect, runEffect } from '../test-utils.ts';

describe('should take', () => {
  it('should take initial value for unobserved access', () => {
    const source = of(0);
    const take0 = source.pipe(take(0));
    expect(readEffect(() => take0.value)).toBe(0);
  });

  it('should never update value for take(0)', () => {
    const source = of(0);
    const take0 = source.pipe(take(0));

    const run1 = runEffect(() => take0.value);
    expect(run1.updates.last).toBe(0);

    source.next(1);
    expect(run1.updates.last).toBe(0);
    expect(run1.updates.current.length).toBe(1);

    source.next(2);
    expect(run1.updates.last).toBe(0);
    expect(run1.updates.current.length).toBe(1);

    run1.dispose();
  });

  it('should be always initial source value for take(0)', () => {
    const source = of(0);
    const take0 = source.pipe(take(0));

    source.next(1);
    const run1 = runEffect(() => take0.value);
    expect(run1.updates.last).toBe(0);
    run1.dispose();
  });

  it('should update value with latest for take(2) on gets observed', () => {
    const source = of(0);
    const take2 = source.pipe(take(2));

    source.next(1);
    const run1 = runEffect(() => take2.value);
    expect(run1.updates.last).toBe(1);
    run1.dispose();

    source.next(2);
    const run2 = runEffect(() => take2.value);
    expect(run2.updates.last).toBe(2);
    run2.dispose();

    source.next(3);
    const run3 = runEffect(() => take2.value);
    expect(run3.updates.last).toBe(2);
    run3.dispose();
  });

  it('should update value with latest for take(2) on unobserved access', () => {
    const source = of(0);
    const take2 = source.pipe(take(2));

    source.next(1);
    expect(readEffect(() => take2.value)).toBe(1);

    expect(readEffect(() => take2.value)).toBe(1);
    expect(readEffect(() => take2.value)).toBe(1);

    source.next(2);
    expect(readEffect(() => take2.value)).toBe(2);

    source.next(3);
    expect(readEffect(() => take2.value)).toBe(2);
  });

  it('should handle most suitable case', () => {
    const onSourceObserved = jest.fn();
    const onSourceUnobserved = jest.fn();

    const source = of(0, () => {
      onSourceObserved();
      return onSourceUnobserved;
    });

    const take3 = source.pipe(take(3));

    expect(onSourceObserved).not.toHaveBeenCalled();
    expect(onSourceUnobserved).not.toHaveBeenCalled();

    const run1 = runEffect(() => take3.value);
    expect(run1.updates.last).toBe(0);
    expect(onSourceObserved).toHaveBeenCalledTimes(1);
    expect(onSourceUnobserved).not.toHaveBeenCalled();

    source.next(1);
    expect(run1.updates.last).toBe(1);

    source.next(2);
    expect(run1.updates.last).toBe(2);

    source.next(3);
    expect(run1.updates.last).toBe(3);
    expect(onSourceObserved).toHaveBeenCalledTimes(1);
    expect(onSourceUnobserved).toHaveBeenCalledTimes(1);

    source.next(4);
    expect(run1.updates.last).toBe(3);

    run1.dispose();
  });

  it('should not count same value as updating', () => {
    const source = of(0);
    const take2 = source.pipe(take(2));

    const run1 = runEffect(() => take2.value);
    source.next(0);
    expect(run1.updates.current).toStrictEqual([0]);
    source.next(0);
    expect(run1.updates.current).toStrictEqual([0]);
    source.next(1);
    expect(run1.updates.current).toStrictEqual([0, 1]);
    source.next(2);
    expect(run1.updates.current).toStrictEqual([0, 1, 2]);
    source.next(3);
    expect(run1.updates.current).toStrictEqual([0, 1, 2]);
  });

  it('should not count same value as updating (unobserved access)', () => {
    const source = of(0);
    const take2 = source.pipe(take(2));

    expect(readEffect(() => take2.value)).toBe(0);
    source.next(0);
    expect(readEffect(() => take2.value)).toBe(0);
    source.next(0);
    expect(readEffect(() => take2.value)).toBe(0);
    source.next(1);
    expect(readEffect(() => take2.value)).toBe(1);
    source.next(2);
    expect(readEffect(() => take2.value)).toBe(2);
    source.next(3);
    expect(readEffect(() => take2.value)).toBe(2);
  });
});
