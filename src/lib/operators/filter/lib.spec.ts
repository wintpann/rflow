import { filter } from './lib.ts';
import { observe } from '../../test-utils.ts';
import { of } from '../../observable';
import { nextTickScheduler } from '../../scheduler';

describe('filter', () => {
  it('should work on unobserved access', () => {
    const source = of(0);
    const filtered = source.pipe(filter((v) => v % 2 === 1));
    const filtered1 = source.pipe(filter((v) => v % 2 === 0));

    expect(source()).toBe(0);
    expect(filtered()).toBe(null);
    expect(filtered1()).toBe(0);

    source.next(1);
    expect(source()).toBe(1);
    expect(filtered()).toBe(1);
    expect(filtered1()).toBe(0);
  });

  it('should work on observed access', () => {
    const source = of(0);
    const filtered = source.pipe(filter((v) => v % 2 === 1));
    const filtered1 = source.pipe(filter((v) => v % 2 === 0));

    const observe1 = observe(filtered);
    const observe2 = observe(filtered1);

    source.next(3);
    source.next(4);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([3]);
    expect(observe2.updates.current).toStrictEqual([4]);

    observe1.dispose();
    observe2.dispose();
  });
});
