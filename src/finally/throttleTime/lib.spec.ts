import { of } from '../observable';
import { observe } from '../test-utils.ts';
import { scheduler } from '../scheduler';
import { throttleTime } from './lib.ts';

jest.mock('lodash-es', () => ({
  throttle: jest.fn((fn: any) => (v: any) => {
    // @ts-ignore
    global.execThrottle = () => fn(v);
  }),
}));

describe('throttleTime', () => {
  it('should work on unobserved access', () => {
    const source = of(2);
    const throttled = source.pipe(throttleTime(200));

    expect(source()).toBe(2);
    expect(throttled()).toBe(2);

    source.next(4);
    expect(source()).toBe(4);
    expect(throttled()).toBe(2);
    // @ts-ignore
    global.execThrottle();
    expect(throttled()).toBe(4);
  });

  it('should work on observed access', () => {
    const source = of(2);
    const throttled = source.pipe(throttleTime(200));

    const observe1 = observe(throttled);

    source.next(3);
    source.next(4);
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([]);
    // @ts-ignore
    global.execThrottle();
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([4]);

    observe1.dispose();
  });
});
