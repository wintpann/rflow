import { map, mapTo } from './lib.ts';
import { observe, watch } from '../../test-utils.ts';
import { of } from '../../observable';
import { nextTickScheduler } from '../../scheduler';

describe('map', () => {
  it('should work on unobserved access', () => {
    const source = of(2);
    const doubled = source.pipe(map((v) => v * 2));

    expect(source()).toBe(2);
    expect(doubled()).toBe(4);

    source.next(4);
    expect(source()).toBe(4);
    expect(doubled()).toBe(8);
  });

  it('should work on observed access', () => {
    const source = of(2);
    const doubled = source.pipe(map((v) => v * 2));

    const observe1 = observe(doubled);

    source.next(3);
    source.next(4);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([8]);

    observe1.dispose();
  });

  it('should run multiple mappers', () => {
    const source = of(2);
    const doubled = source.pipe(map((v) => v * 2));
    const doubledPlusOne = doubled.pipe(map((v) => v + 1));

    const observe1 = observe(doubledPlusOne);
    source.next(3);
    source.next(4);
    nextTickScheduler.flush();
    expect(doubledPlusOne()).toBe(9);

    observe1.dispose();
  });

  it('should mapTo', () => {
    const source = of(null);
    const asterisk = source.pipe(mapTo('*'));

    const watch1 = watch(asterisk);
    source.next(null);
    source.next(null);
    expect(watch1.updates.current).toStrictEqual(['*', '*']);
    watch1.dispose();
  });
});
