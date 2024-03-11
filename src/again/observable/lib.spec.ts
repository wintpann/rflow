import { createObservable, isObservable } from './lib.ts';
import { read, observe } from '../test-utils.ts';
import { MissedAPI } from './typings.ts';
import { scheduler } from '../scheduler';

describe('createObservable', () => {
  it('should create observable', () => {
    const source = createObservable({ a: 1, b: 2 });
    expect(source()).toStrictEqual({ a: 1, b: 2 });
    expect(isObservable(source)).toBe(true);
    expect(isObservable(() => undefined)).toBe(false);
    expect(isObservable({})).toBe(false);
    expect(isObservable(2)).toBe(false);
  });

  it('should call onObserved/onUnobserved & onBecomesObserved/onBecomesUnobserved', () => {
    const onObserved = jest.fn();
    const onUnobserved = jest.fn();
    const onBecomesObserved = jest.fn();
    const onBecomesUnobserved = jest.fn();

    const source = createObservable('0', {
      onObserved: () => {
        onObserved();
        return onUnobserved;
      },
      onBecomesObserved: () => {
        onBecomesObserved();
        return onBecomesUnobserved;
      },
    });

    read(source);
    expect(onObserved).not.toHaveBeenCalled();
    expect(onUnobserved).not.toHaveBeenCalled();
    expect(onBecomesObserved).not.toHaveBeenCalled();
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    const run1 = observe(source);
    expect(onObserved).toHaveBeenCalledTimes(1);
    expect(onUnobserved).not.toHaveBeenCalled();
    expect(onBecomesObserved).toHaveBeenCalledTimes(1);
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    const run2 = observe(source);
    expect(onObserved).toHaveBeenCalledTimes(2);
    expect(onUnobserved).not.toHaveBeenCalled();
    expect(onBecomesObserved).toHaveBeenCalledTimes(1);
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    run1.dispose();
    expect(onUnobserved).toHaveBeenCalledTimes(1);
    expect(onBecomesUnobserved).toHaveBeenCalledTimes(0);

    run2.dispose();
    expect(onUnobserved).toHaveBeenCalledTimes(2);
    expect(onBecomesUnobserved).toHaveBeenCalledTimes(1);
  });

  it('should create api & update value', () => {
    const source = createObservable<{ count: number }, MissedAPI>(
      { count: 0 },
      {
        enableAPI: true,
      },
    ).api((self) => ({
      increase: () => ({ count: self().count + 1 }),
      set: (count: number) => ({ count }),
    }));

    const run1 = observe(source);
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([]);

    source.set(1);
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([{ count: 1 }]);

    source.increase();
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([{ count: 1 }, { count: 2 }]);

    run1.dispose();
  });

  it('should not notify observers if value not shallow changed', () => {
    const initial = { a: 0, b: 0 };
    const source = createObservable<{ a: number; b: number }, MissedAPI>(
      initial,
      { enableAPI: true },
    ).api({
      set: (value: { a: number; b: number }) => value,
    });

    const run1 = observe(source);
    source.set(initial);
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([]);

    source.set(initial);
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([]);

    source.set({ a: 0, b: 0 });
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([{ a: 0, b: 0 }]);

    run1.dispose();
  });

  it('should schedule multiple sync updates', () => {
    const source = createObservable<number, MissedAPI>(0, {
      enableAPI: true,
    }).api((self) => ({
      increase: () => self() + 1,
    }));

    const run1 = observe(source);
    source.increase();
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([1]);

    source.increase();
    source.increase();
    source.increase();
    source.increase();
    scheduler.flush();
    expect(run1.updates.current).toStrictEqual([1, 5]);
  });
});
