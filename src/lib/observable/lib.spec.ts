import { observable, isObservable, of } from './lib.ts';
import { observe, watch } from '../test-utils.ts';
import { scheduler } from '../scheduler';

describe('observable', () => {
  it('should create observable', () => {
    const source = of({ a: 1, b: 2 });
    expect(source()).toStrictEqual({ a: 1, b: 2 });
    expect(isObservable(source)).toBe(true);
    expect(isObservable(() => undefined)).toBe(false);
    expect(isObservable({})).toBe(false);
    expect(isObservable(2)).toBe(false);
  });

  it('should create api & update value', () => {
    const source = observable({ count: 0 }).create((next) => ({
      increase: () => next((prev) => ({ count: prev.count + 1 })),
      set: (count: number) => next({ count }),
    }));

    const observe1 = observe(source);
    const watch1 = watch(source);
    expect(observe1.updates.current).toStrictEqual([]);
    expect(watch1.updates.current).toStrictEqual([]);

    source.set(1);
    expect(observe1.updates.current).toStrictEqual([]);
    expect(watch1.updates.current).toStrictEqual([{ count: 1 }]);
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([{ count: 1 }]);
    expect(watch1.updates.current).toStrictEqual([{ count: 1 }]);

    source.increase();
    expect(observe1.updates.current).toStrictEqual([{ count: 1 }]);
    expect(watch1.updates.current).toStrictEqual([{ count: 1 }, { count: 2 }]);
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([
      { count: 1 },
      { count: 2 },
    ]);
    expect(watch1.updates.current).toStrictEqual([{ count: 1 }, { count: 2 }]);

    observe1.dispose();
    watch1.dispose();
  });

  it('should schedule multiple sync updates', () => {
    const source = observable(0).create((next) => ({
      increase: () => next((prev) => prev + 1),
    }));

    const observe1 = observe(source);
    const watch1 = watch(source);
    source.increase();
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([1]);
    expect(watch1.updates.current).toStrictEqual([1]);

    source.increase();
    source.increase();
    source.increase();
    source.increase();
    scheduler.flush();
    expect(observe1.updates.current).toStrictEqual([1, 5]);
    expect(watch1.updates.current).toStrictEqual([1, 2, 3, 4, 5]);
  });
});
