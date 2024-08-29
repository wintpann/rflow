import { map } from './lib.ts';
import { observe } from '../test-utils.ts';
import { of } from '../observable';
import { scheduler } from '../scheduler';

describe('map', () => {
  it('should work on unobserved access', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));

    expect(doubler).toHaveBeenCalledTimes(1);
    expect(source()).toBe(2);
    expect(doubled()).toBe(4);

    source.next(4);
    expect(doubler).toHaveBeenCalledTimes(2);
    expect(source()).toBe(4);
    expect(doubled()).toBe(8);
  });

  it('should work on observed access', () => {
    const doubler: (num: number) => number = jest.fn((v) => v * 2);

    const source = of(2);
    const doubled = source.pipe(map(doubler));
    expect(doubler).toHaveBeenCalledTimes(1);

    const run1 = observe(doubled);
    expect(doubler).toHaveBeenCalledTimes(2);
    const run2 = observe(doubled);
    expect(doubler).toHaveBeenCalledTimes(2);

    source.next(3);
    source.next(4);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(3);
    expect(run1.updates.current).toStrictEqual([8]);
    expect(run2.updates.current).toStrictEqual([8]);

    run1.dispose();
    run2.dispose();
  });

  it('should calculate value & not schedule update if observed and source hasScheduledUpdate', () => {
    const source = of(1);
    const doubler: (num: number) => number = jest.fn((v) => v * 2);
    const doubled = source.pipe(map(doubler));
    const doubledObserve = jest.fn();

    const dispose1 = doubled.observe(doubledObserve);
    source.next(2);
    expect(doubled()).toBe(4);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(4);
    expect(doubledObserve).not.toHaveBeenCalled();

    dispose1();
  });

  it('should calculate value & not schedule update on BO cause source could have changed & updated', () => {
    const source = of(1);
    const doubled = source.pipe(map((v) => v * 2));
    const doubledObserve = jest.fn();

    source.next(2);
    source.next(3);
    scheduler.flush();
    const dispose1 = doubled.observe(doubledObserve);
    expect(doubled()).toBe(6);
    scheduler.flush();
    expect(doubledObserve).not.toHaveBeenCalled();

    dispose1();
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
    expect(doubler).toHaveBeenCalledTimes(4);
    expect(plusOne).toHaveBeenCalledTimes(2);

    const run2 = observe(doubledPlusOne);
    expect(doubler).toHaveBeenCalledTimes(4);
    expect(plusOne).toHaveBeenCalledTimes(2);

    source.next(3);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(5);
    expect(plusOne).toHaveBeenCalledTimes(3);

    const run3 = observe(doubledPlusOne);
    expect(doubler).toHaveBeenCalledTimes(5);
    expect(plusOne).toHaveBeenCalledTimes(3);

    source.next(4);
    scheduler.flush();
    expect(doubler).toHaveBeenCalledTimes(6);
    expect(plusOne).toHaveBeenCalledTimes(4);

    run1.dispose();
    run2.dispose();
    run3.dispose();
  });
});
