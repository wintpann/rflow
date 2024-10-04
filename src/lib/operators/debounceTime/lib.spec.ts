import { of } from '../../observable';
import { observe } from '../../test-utils.ts';
import { nextTickScheduler } from '../../scheduler';
import { debounceTime } from './lib.ts';

jest.mock('lodash-es', () => ({
  debounce: jest.fn((fn: any) => (v: any) => {
    // @ts-ignore
    global.execDebounce = () => fn(v);
  }),
}));

describe('debounceTime', () => {
  it('should work on unobserved access', () => {
    const source = of(2);
    const debounced = source.pipe(debounceTime(200));

    expect(source()).toBe(2);
    expect(debounced()).toBe(2);

    source.next(4);
    expect(source()).toBe(4);
    expect(debounced()).toBe(2);
    // @ts-ignore
    global.execDebounce();
    expect(debounced()).toBe(4);
  });

  it('should work on observed access', () => {
    const source = of(2);
    const debounced = source.pipe(debounceTime(200));

    const observe1 = observe(debounced);

    source.next(3);
    source.next(4);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([]);
    // @ts-ignore
    global.execDebounce();
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([4]);

    observe1.dispose();
  });
});
