import { of } from '../of/lib.ts';
import { map } from './lib.ts';
import { readEffect, runEffect } from '../../test-utils.ts';
import { runInAction } from 'mobx';

describe('should map', () => {
  it('should run mapper on unobserved access', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));

    expect(doubler).not.toHaveBeenCalled();
    expect(readEffect(() => source.value)).toBe(2);
    expect(doubler).not.toHaveBeenCalled();

    expect(readEffect(() => doubled.value)).toBe(4);
    expect(doubler).toHaveBeenCalledTimes(1);
  });

  it('should run mapper on observed access once until source changed', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));

    const run1 = runEffect(() => doubled.value);
    expect(doubler).toHaveBeenCalledTimes(1);
    const run2 = runEffect(() => doubled.value);
    expect(doubler).toHaveBeenCalledTimes(1);

    source.next(3);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(run1.updates.current).toStrictEqual([4, 6]);
    expect(run2.updates.current).toStrictEqual([4, 6]);

    run1.dispose();
    run2.dispose();
  });

  it('should run mapper only if accessed property changed', () => {
    type Source = { a: number; b: number };

    const pluckA: (arg: Source) => Source['a'] = jest.fn((v) => v.a);
    const pluckB: (arg: Source) => Source['b'] = jest.fn((v) => v.b);

    const source = of<Source>({ a: 0, b: 1 });
    const pluckedA = source.pipe(map(pluckA));
    const pluckedB = source.pipe(map(pluckB));

    const runA = runEffect(() => pluckedA.value);
    expect(pluckA).toHaveBeenCalledTimes(1);

    const runB = runEffect(() => pluckedB.value);
    expect(pluckB).toHaveBeenCalledTimes(1);

    source.next({ a: 0, b: 1 });
    // because reference to parent object changed
    expect(pluckA).toHaveBeenCalledTimes(2);
    expect(pluckB).toHaveBeenCalledTimes(2);

    runInAction(() => {
      source.value.a++;
    });
    expect(pluckA).toHaveBeenCalledTimes(3);
    expect(pluckB).toHaveBeenCalledTimes(2);

    runInAction(() => {
      source.value.b++;
    });
    expect(pluckA).toHaveBeenCalledTimes(3);
    expect(pluckB).toHaveBeenCalledTimes(3);

    runA.dispose();
    runB.dispose();
  });

  it('should run multiple mappers', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const plusOne: (num: number) => number = jest.fn((v) => v + 1);

    const source = of(2);
    const doubled = source.pipe(map(doubler));
    const doubledPlusOne = doubled.pipe(map(plusOne));

    expect(doubler).not.toHaveBeenCalled();
    expect(plusOne).not.toHaveBeenCalled();

    readEffect(() => doubledPlusOne.value);
    expect(doubler).toHaveBeenCalledTimes(1);
    expect(plusOne).toHaveBeenCalledTimes(1);

    readEffect(() => doubledPlusOne.value);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(plusOne).toHaveBeenCalledTimes(2);

    source.next(3);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(plusOne).toHaveBeenCalledTimes(2);

    const run1 = runEffect(() => doubledPlusOne.value);
    expect(doubler).toHaveBeenCalledTimes(3);
    expect(plusOne).toHaveBeenCalledTimes(3);

    source.next(4);
    expect(doubler).toHaveBeenCalledTimes(4);
    expect(plusOne).toHaveBeenCalledTimes(4);

    run1.dispose();
  });
});
