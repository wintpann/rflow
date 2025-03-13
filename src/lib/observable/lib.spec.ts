import { observable, isObservable, of, readTracker } from './lib.ts';
import { observe, observeSync, read } from '../test-utils.ts';
import { nextTickScheduler } from '../scheduler';

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
    const source = observable({ count: 0 }).api((next) => ({
      increase: () => next((prev) => ({ count: prev.count + 1 })),
      set: (count: number) => next({ count }),
    }));

    const observe1 = observe(source);
    const observeSync1 = observeSync(source);
    expect(observe1.updates.current).toStrictEqual([]);
    expect(observeSync1.updates.current).toStrictEqual([]);

    source.set(1);
    expect(observe1.updates.current).toStrictEqual([]);
    expect(observeSync1.updates.current).toStrictEqual([{ count: 1 }]);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([{ count: 1 }]);
    expect(observeSync1.updates.current).toStrictEqual([{ count: 1 }]);

    source.increase();
    expect(observe1.updates.current).toStrictEqual([{ count: 1 }]);
    expect(observeSync1.updates.current).toStrictEqual([
      { count: 1 },
      { count: 2 },
    ]);
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([
      { count: 1 },
      { count: 2 },
    ]);
    expect(observeSync1.updates.current).toStrictEqual([
      { count: 1 },
      { count: 2 },
    ]);

    observe1.dispose();
    observeSync1.dispose();
  });

  it('should schedule multiple sync updates', () => {
    const source = observable(0).api((next) => ({
      increase: () => next((prev) => prev + 1),
    }));

    const observe1 = observe(source);
    const observeSync1 = observeSync(source);
    source.increase();
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([1]);
    expect(observeSync1.updates.current).toStrictEqual([1]);

    source.increase();
    source.increase();
    source.increase();
    source.increase();
    nextTickScheduler.flush();
    expect(observe1.updates.current).toStrictEqual([1, 5]);
    expect(observeSync1.updates.current).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe('readTracker', () => {
  it('should track read', () => {
    const source1 = of(0);
    const source2 = of(0);
    const source3 = of(0);

    const untrack1 = readTracker.track();
    expect(Array.from(untrack1())).toStrictEqual([]);

    const untrack2 = readTracker.track();
    read(source1);
    expect(Array.from(untrack2())).toStrictEqual([source1]);
    expect(Array.from(untrack1())).toStrictEqual([]);

    const untrack3 = readTracker.track();
    read(source1);
    read(source2);
    read(source3);
    read(source2);
    expect(Array.from(untrack3())).toStrictEqual([source1, source2, source3]);
    expect(Array.from(untrack2())).toStrictEqual([source1]);
    expect(Array.from(untrack1())).toStrictEqual([]);
  });
});
