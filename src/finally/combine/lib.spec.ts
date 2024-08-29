import { of } from '../observable';
import { combine } from './lib.ts';
import { observe } from '../test-utils.ts';
import { scheduler } from '../scheduler';

describe('combine', () => {
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

  it('should calculate value & not schedule update if observed and source hasScheduledUpdate', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);
    const combinedObserve = jest.fn();

    const dispose1 = combined.observe(combinedObserve);
    text.next('1');
    count.next(1);
    expect(combined()).toStrictEqual(['1', 0]);
    scheduler.flush();
    expect(combinedObserve).not.toHaveBeenCalled();

    dispose1();
  });

  it('should calculate value & not schedule update on BO cause source could have changed & updated', () => {
    const [text, count] = [of('text'), of(0)];
    const combined = combine(text, count);
    const combinedObserve = jest.fn();

    text.next('1');
    count.next(1);
    scheduler.flush();
    const dispose1 = combined.observe(combinedObserve);
    expect(combined()).toStrictEqual(['1', 1]);
    scheduler.flush();
    expect(combinedObserve).not.toHaveBeenCalled();

    dispose1();
  });

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
});
