import { interval } from './lib.ts';
import { delay, readEffect, runEffect } from '../../test-utils.ts';

describe('should create interval', () => {
  it('should create interval with initial value of 0', () => {
    const source = interval(100);
    expect(readEffect(() => source.value)).toBe(0);
  });

  it('should create interval with specified initial value', () => {
    const source = interval(100, { from: 10 });
    expect(readEffect(() => source.value)).toBe(10);
  });

  it('should not run interval on unobserved access', async () => {
    const source = interval(10);
    expect(readEffect(() => source.value)).toBe(0);

    await delay(20);
    expect(readEffect(() => source.value)).toBe(0);
  });

  it('should run interval on observed access and stop interval on unobserved', async () => {
    const source = interval(10);
    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(0);

    await delay(15);
    expect(run1.updates.last).toBe(1);

    run1.dispose();

    await delay(10);
    expect(readEffect(() => source.value)).toBe(1);
  });

  it('should run interval and immediate increment on gets observed', async () => {
    const source = interval(10, { immediateIncrement: true });
    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(1);

    await delay(15);
    expect(run1.updates.last).toBe(2);

    run1.dispose();

    await delay(10);
    expect(readEffect(() => source.value)).toBe(2);
  });

  it('should run interval with specified step', async () => {
    const source = interval(10, { step: 3 });
    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(0);

    await delay(15);
    expect(run1.updates.last).toBe(3);

    run1.dispose();

    await delay(10);
    expect(readEffect(() => source.value)).toBe(3);
  });
});
