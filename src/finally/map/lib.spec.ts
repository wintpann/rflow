import { map } from './lib.ts';
import { read, observe } from '../test-utils.ts';
import { of } from '../observable';
import { scheduler } from '../scheduler';

describe('map', () => {
  it('should run mapper on unobserved access', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));

    expect(doubler).toHaveBeenCalledTimes(1);
    expect(read(source)).toBe(2);
    expect(read(doubled)).toBe(4);

    source.next(4);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(read(source)).toBe(4);
    expect(read(doubled)).toBe(8);
  });

  it('should run mapper on observed access once until source changed', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));
    expect(doubler).toHaveBeenCalledTimes(1);

    const run1 = observe(doubled);
    expect(doubler).toHaveBeenCalledTimes(1);
    const run2 = observe(doubled);
    expect(doubler).toHaveBeenCalledTimes(1);

    source.next(3);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(run1.updates.current).toStrictEqual([6]);
    expect(run2.updates.current).toStrictEqual([6]);

    run1.dispose();
    run2.dispose();
  });

  it('should run multiple mappers', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);
    const plusOne: (num: number) => number = jest.fn((v) => v + 1);

    const source = of(2);
    const doubled = source.pipe(map(doubler));
    const doubledPlusOne = doubled.pipe(map(plusOne));

    expect(doubler).toHaveBeenCalledTimes(2);
    expect(plusOne).toHaveBeenCalledTimes(1);

    const run1 = observe(doubledPlusOne);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(plusOne).toHaveBeenCalledTimes(1);

    const run2 = observe(doubledPlusOne);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(plusOne).toHaveBeenCalledTimes(1);

    source.next(3);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(3);
    expect(plusOne).toHaveBeenCalledTimes(2);

    const run3 = observe(doubledPlusOne);
    expect(doubler).toHaveBeenCalledTimes(3);
    expect(plusOne).toHaveBeenCalledTimes(2);

    source.next(4);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(4);
    expect(plusOne).toHaveBeenCalledTimes(3);

    run1.dispose();
    run2.dispose();
    run3.dispose();
  });

  it('should force calculating value if observed but source has coming update', () => {
    const source = of(1);
    const doubler: (num: number) => number = jest.fn((v) => v * 2);
    const doubled = source.pipe(map(doubler));

    const run1 = observe(doubled);
    source.next(2);
    expect(doubled()).toBe(4);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(3);

    run1.dispose();
  });

  it('should not schedule update on read with coming update from source', () => {
    const doubledObserve = jest.fn();

    const source = of(1);
    const doubled = source.pipe(map((v) => v * 2));

    source.next(2);
    const dispose1 = doubled.observe(doubledObserve);
    read(doubled);
    scheduler.flush();

    expect(doubledObserve).not.toHaveBeenCalled();
    dispose1();
  });

  it('should get actual value after subscription when source has changed & updated', () => {
    const source = of(1);
    const doubled = source.pipe(map((v) => v * 2));

    source.next(2);
    source.next(3);
    scheduler.flush();
    const run1 = observe(doubled);
    expect(doubled()).toBe(6);
    run1.dispose();
  });
});
