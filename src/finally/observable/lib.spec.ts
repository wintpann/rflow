import { observable, isObservable, of } from './lib.ts';
import { observe, read } from '../test-utils.ts';
import { scheduler } from '../scheduler';
import { combine } from '../combine';
import { map } from '../map';
import { distinctUntilChanged } from '../distinctUntilChanged';

describe('observable', () => {
  it('should create observable', () => {
    const source = of({ a: 1, b: 2 });
    expect(source()).toStrictEqual({ a: 1, b: 2 });
    expect(isObservable(source)).toBe(true);
    expect(isObservable(() => undefined)).toBe(false);
    expect(isObservable({})).toBe(false);
    expect(isObservable(2)).toBe(false);
  });

  it('should not create if unsupported handler', () => {
    const thrown = {
      $type: false,
      observe: false,
      pipe: false,
    };
    try {
      observable(0).create({
        api: (next) => ({ $type: next }),
      });
    } catch (e) {
      thrown.$type = true;
    }
    try {
      observable(0).create({
        api: (next) => ({ observe: next }),
      });
    } catch (e) {
      thrown.observe = true;
    }
    try {
      observable(0).create({
        api: (next) => ({ pipe: next }),
      });
    } catch (e) {
      thrown.pipe = true;
    }
    expect(thrown).toStrictEqual({ $type: true, observe: true, pipe: true });
  });

  it('should call onBecomesObserved/onBecomesUnobserved', () => {
    const onBecomesObserved = jest.fn();
    const onBecomesUnobserved = jest.fn();

    const source = observable('0').create({
      reflect: {
        onBecomesObserved: () => {
          onBecomesObserved();
          return onBecomesUnobserved;
        },
      },
    });

    read(source);
    expect(onBecomesObserved).not.toHaveBeenCalled();
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    const run1 = observe(source);
    expect(onBecomesObserved).toHaveBeenCalledTimes(1);
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    const run2 = observe(source);
    expect(onBecomesObserved).toHaveBeenCalledTimes(1);
    expect(onBecomesUnobserved).not.toHaveBeenCalled();

    run1.dispose();
    expect(onBecomesUnobserved).toHaveBeenCalledTimes(0);

    run2.dispose();
    expect(onBecomesUnobserved).toHaveBeenCalledTimes(1);
  });

  it('should create api & update value', () => {
    const source = observable({ count: 0 }).create({
      api: (next) => ({
        increase: () => next((prev) => ({ count: prev.count + 1 })),
        set: (count: number) => next({ count }),
      }),
    });

    const run1 = observe(source);
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
    const source = observable(initial).create({
      api: (next) => ({
        set: (value: typeof initial) => next(value),
      }),
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
    const source = observable(0).create({
      api: (next) => ({
        increase: () => next((prev) => prev + 1),
      }),
    });

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

  it('should know when hasScheduledUpdates all the parents up', () => {
    const parent1 = of(1);
    const parent2 = of('1');

    const down1 = combine(parent1, parent2);
    const down2 = down1.pipe(map(([v1, v2]) => `${v1}${v2}`));
    const down3 = down2.pipe(distinctUntilChanged());

    const run1 = observe(down3);
    parent1.next(2);
    parent2.next('2');
    expect(down3()).toBe('22');
    scheduler.flush();

    run1.dispose();
  });
});
