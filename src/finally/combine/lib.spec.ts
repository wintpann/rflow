import { of } from '../observable';
import { combine } from './lib.ts';
import { observe } from '../test-utils.ts';
import { scheduler } from '../scheduler';

describe('combine', () => {
  it('should create as array', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);
    expect(combined()).toStrictEqual(['text', 0]);
  });

  it('should create as struct', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine({ text, count });
    expect(combined()).toStrictEqual({ text: 'text', count: 0 });
  });

  it('should work on unobserved access', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);

    text.next('next');
    count.next(1);
    expect(combined()).toStrictEqual(['next', 1]);
  });

  it('should work on observed access', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);

    const run1 = observe(combined);
    text.next('1');
    text.next('2');
    count.next(1);
    count.next(2);
    scheduler.flush();

    expect(run1.updates.current).toStrictEqual([['2', 2]]);
  });

  /*  it('should not schedule update on unobserved read', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);
    const combinedObserve = jest.fn();

    text.next('1');
    count.next(1);
    read(combined);
    const dispose1 = combined.observe(combinedObserve);
    scheduler.flush();

    expect(combinedObserve).not.toHaveBeenCalled();
    dispose1();
  })*/
});
