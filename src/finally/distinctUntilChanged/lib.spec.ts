import { of } from '../observable';
import { distinctUntilChanged } from './lib.ts';
import { observe } from '../test-utils.ts';
import { scheduler } from '../scheduler';
import { map } from '../map';

describe('distinctUntilChanged', () => {
  it('should work on unobserved access', () => {
    const source = of(2);
    const distincted = source.pipe(distinctUntilChanged());

    expect(source()).toBe(2);
    expect(distincted()).toBe(2);

    source.next(4);
    expect(source()).toBe(4);
    expect(distincted()).toBe(4);
  });

  it('should work on observed access', () => {
    const source = of(2);
    const distincted = source.pipe(distinctUntilChanged());

    const run1 = observe(distincted);
    const run2 = observe(distincted);

    source.next(3);
    source.next(4);
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([4]);
    expect(run2.updates.current).toStrictEqual([4]);

    run1.dispose();
    run2.dispose();
  });

  it('should calculate value & not schedule update if observed and source hasScheduledUpdate', () => {
    const source = of(1);
    const distincted = source.pipe(distinctUntilChanged());
    const distinctedObserve = jest.fn();

    const dispose1 = distincted.observe(distinctedObserve);
    source.next(2);
    expect(distincted()).toBe(2);
    scheduler.flush();
    expect(distinctedObserve).not.toHaveBeenCalled();

    dispose1();
  });

  it('should calculate value & not schedule update on BO cause source could have changed & updated', () => {
    const source = of(1);
    const distincted = source.pipe(distinctUntilChanged());
    const distinctedObserve = jest.fn();

    source.next(2);
    source.next(3);
    scheduler.flush();
    const dispose1 = distincted.observe(distinctedObserve);
    expect(distincted()).toBe(3);
    scheduler.flush();
    expect(distinctedObserve).not.toHaveBeenCalled();

    dispose1();
  });

  it('should work with default shallow comparer', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());

    expect(source()).toStrictEqual([1]);
    expect(distincted()).toStrictEqual([1]);

    const runSource = observe(source);
    const runDistincted = observe(distincted);

    expect(runSource.updates.current).toStrictEqual([]);
    expect(runDistincted.updates.current).toStrictEqual([]);

    source.next([1, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([[1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([1, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([2, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([
      [1, 2],
      [2, 2],
    ]);

    runSource.dispose();
    runDistincted.dispose();
  });

  it('should work with custom comparer', () => {
    const source = of([1]);
    const distincted = source.pipe(
      distinctUntilChanged((a, b) => a.length === b.length),
    );

    expect(source()).toStrictEqual([1]);
    expect(distincted()).toStrictEqual([1]);

    const runSource = observe(source);
    const runDistincted = observe(distincted);

    expect(runSource.updates.current).toStrictEqual([]);
    expect(runDistincted.updates.current).toStrictEqual([]);

    source.next([1, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([[1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([1, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([2, 2]);
    scheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    runSource.dispose();
    runDistincted.dispose();
  });

  it('should assume lastValue as becomes observed', () => {
    const source = of(1);
    const distincted = source.pipe(
      map((el) => [el]),
      distinctUntilChanged(),
    );

    source.next(2);
    source.next(3);
    source.next(4);
    scheduler.flush();
    const run1 = observe(distincted);
    source.next(1);
    scheduler.flush();

    expect(run1.updates.current).toStrictEqual([[1]]);
    run1.dispose();
  });
});
