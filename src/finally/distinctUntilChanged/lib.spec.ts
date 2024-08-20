import { of } from '../observable';
import { distinctUntilChanged } from './lib.ts';
import { observe, read } from '../test-utils.ts';
import { scheduler } from '../scheduler';
import { map } from '../map';

describe('distinctUntilChanged', () => {
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

  it('should force calculating value if observed but source has coming update', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());

    const run1 = observe(distincted);
    source.next([2]);
    expect(distincted()).toStrictEqual([2]);
    scheduler.flush();

    run1.dispose();
  });

  it('should not schedule update on read with coming update from source', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());
    const distinctedObserve = jest.fn();

    source.next([2]);
    const dispose1 = distincted.observe(distinctedObserve);
    read(distincted);
    scheduler.flush();

    expect(distinctedObserve).not.toHaveBeenCalled();
    dispose1();
  });

  it('should get actual value after subscription when source has changed & updated', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());

    source.next([2]);
    scheduler.flush();
    const run1 = observe(distincted);
    expect(distincted()).toStrictEqual([2]);
    scheduler.flush();

    run1.dispose();
  });
});
