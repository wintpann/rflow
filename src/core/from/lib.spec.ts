import { from } from './lib.ts';
import { delay, readEffect, runEffect } from '../test-utils.ts';
import { of } from '../of/lib.ts';

const createAsyncIterable = () => ({
  values: [1, 2, 3, 4, 5, 6],

  wait: () => new Promise((resolve) => setTimeout(resolve, 10)),

  async *[Symbol.asyncIterator]() {
    for (const value of this.values) {
      await this.wait();
      yield value;
    }
  },
});

describe('should create observable from iterable', () => {
  it('should start interval on observed', async () => {
    const source = from([1, 2, 3], 10);

    expect(readEffect(() => source.value)).toBe(1);

    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(1);

    await delay(15);
    expect(run1.updates.current).toStrictEqual([1, 2]);

    await delay(15);
    expect(run1.updates.current).toStrictEqual([1, 2, 3]);
  });

  it('should clear interval if gets unobserved before next value', async () => {
    const source = from([1, 2, 3], 10);

    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(1);

    await delay(15);
    expect(run1.updates.current).toStrictEqual([1, 2]);
    run1.dispose();

    await delay(15);
    expect(run1.updates.current).toStrictEqual([1, 2]);

    const run2 = runEffect(() => source.value);
    expect(run2.updates.current).toStrictEqual([2]);
    run2.dispose();
    await delay(10);
    expect(run2.updates.current).toStrictEqual([2]);
  });
});

describe('should create observable from asyncIterable', () => {
  it('should take initial value and not wait for next() until gets observed', async () => {
    const asyncIterable = createAsyncIterable();

    const source = from(asyncIterable, 0);
    expect(readEffect(() => source.value)).toBe(0);
    await delay(15);
    expect(readEffect(() => source.value)).toBe(0);
  });

  it('should run when gets observed and not emit next value until gets observed next time', async () => {
    const asyncIterable = createAsyncIterable();

    const source = from(asyncIterable, 0);
    const run1 = runEffect(() => source.value);
    await delay(15);
    expect(run1.updates.current).toStrictEqual([0, 1]);
    run1.dispose();

    await delay(15);
    expect(run1.updates.current).toStrictEqual([0, 1]);

    const run2 = runEffect(() => source.value);
    expect(run2.updates.last).toBe(2);
    await delay(15);
    expect(run2.updates.last).toBe(3);
    run2.dispose();
  });
});

describe('should create cloned observable', () => {
  it('should clone observable', () => {
    const source = of(0);
    const clone = from(source);

    expect(readEffect(() => clone.value)).toBe(0);

    source.next(1);
    expect(readEffect(() => clone.value)).toBe(1);

    const run1 = runEffect(() => clone.value);
    expect(run1.updates.last).toBe(1);

    source.next(2);
    expect(run1.updates.last).toBe(2);
  });
});
