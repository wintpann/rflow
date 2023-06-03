import { distinctUntilChanged } from './lib.ts';
import { readEffect, runEffect } from '../test-utils.ts';
import { of } from '../of/lib.ts';

describe('distinctUntilChanged', () => {
  it('should distinct until changed with default shallow comparer', () => {
    const source = of([1]);
    const distincted = source.pipe(distinctUntilChanged());

    expect(readEffect(() => source.raw)).toStrictEqual([1]);
    expect(readEffect(() => distincted.raw)).toStrictEqual([1]);

    const runSource = runEffect(() => source.raw);
    const runDistincted = runEffect(() => distincted.raw);

    expect(runSource.updates.current).toStrictEqual([[1]]);
    expect(runDistincted.updates.current).toStrictEqual([[1]]);

    source.mutate((value) => {
      value.push(2);
    });
    expect(runSource.updates.current).toStrictEqual([[1], [1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2]]);

    source.next([1, 2]);
    expect(runSource.updates.current).toStrictEqual([[1], [1, 2], [1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2]]);

    source.next([2, 2]);
    expect(runSource.updates.current).toStrictEqual([
      [1],
      [1, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2], [2, 2]]);

    runSource.dispose();
    runDistincted.dispose();
  });

  it('should distinct until changed with custom comparer', () => {
    const source = of([1]);
    const distincted = source.pipe(
      distinctUntilChanged((a, b) => a.length === b.length),
    );

    expect(readEffect(() => source.raw)).toStrictEqual([1]);
    expect(readEffect(() => distincted.raw)).toStrictEqual([1]);

    const runSource = runEffect(() => source.raw);
    const runDistincted = runEffect(() => distincted.raw);

    expect(runSource.updates.current).toStrictEqual([[1]]);
    expect(runDistincted.updates.current).toStrictEqual([[1]]);

    source.mutate((value) => {
      value.push(2);
    });
    expect(runSource.updates.current).toStrictEqual([[1], [1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2]]);

    source.next([1, 2]);
    expect(runSource.updates.current).toStrictEqual([[1], [1, 2], [1, 2]]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2]]);

    source.next([2, 2]);
    expect(runSource.updates.current).toStrictEqual([
      [1],
      [1, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(runDistincted.updates.current).toStrictEqual([[1], [1, 2]]);

    runSource.dispose();
    runDistincted.dispose();
  });
});
