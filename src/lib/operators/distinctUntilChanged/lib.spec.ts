import { of } from '../../observable';
import { distinctUntilChanged } from './lib.ts';
import { observe } from '../../test-utils.ts';
import { nextTickScheduler } from '../../scheduler';

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

    const observe1 = observe(distincted);
    const observe2 = observe(distincted);

    source.next(3);
    source.next(4);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([4]);
    expect(observe2.updates.current).toStrictEqual([4]);

    observe1.dispose();
    observe2.dispose();
  });

  it('should work with default deep comparer', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());

    expect(source()).toStrictEqual([1]);
    expect(distincted()).toStrictEqual([1]);

    const runSource = observe(source);
    const runDistincted = observe(distincted);

    expect(runSource.updates.current).toStrictEqual([]);
    expect(runDistincted.updates.current).toStrictEqual([]);

    source.next([1, 2]);
    nextTickScheduler.flush();
    expect(runSource.updates.current).toStrictEqual([[1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([1, 2]);
    nextTickScheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([2, 2]);
    nextTickScheduler.flush();
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
    nextTickScheduler.flush();
    expect(runSource.updates.current).toStrictEqual([[1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([1, 2]);
    nextTickScheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    source.next([2, 2]);
    nextTickScheduler.flush();
    expect(runSource.updates.current).toStrictEqual([
      [1, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1, 2]]);

    runSource.dispose();
    runDistincted.dispose();
  });
});
