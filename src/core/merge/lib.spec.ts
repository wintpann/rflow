import { of } from '../of/lib.ts';
import { merge } from './lib.ts';
import { readEffect, runEffect } from '../test-utils.ts';

describe('should merge', () => {
  it('should merge multiple observables with initial of last updated(created) source', () => {
    const source1 = of(1);
    const source2 = of(2);
    const source3 = of(3);

    const merged1 = merge(source1, source2, source3);
    expect(readEffect(() => merged1.value)).toBe(3);

    source1.next(11);
    const merged2 = merge(source1, source2, source3);
    expect(readEffect(() => merged2.value)).toBe(11);
  });

  it('should subscribe/unsubscribe all source observables', () => {
    const observed = {
      source1: jest.fn(),
      source2: jest.fn(),
    };
    const unobserved = {
      source1: jest.fn(),
      source2: jest.fn(),
    };

    const source1 = of(1, () => {
      observed.source1();
      return unobserved.source1;
    });

    const source2 = of(2, () => {
      observed.source2();
      return unobserved.source2;
    });

    const merged = merge(source1, source2);

    expect(observed.source1).not.toHaveBeenCalled();
    expect(observed.source2).not.toHaveBeenCalled();
    expect(unobserved.source1).not.toHaveBeenCalled();
    expect(unobserved.source2).not.toHaveBeenCalled();

    const run1 = runEffect(() => merged.value);
    expect(observed.source1).toHaveBeenCalledTimes(1);
    expect(observed.source2).toHaveBeenCalledTimes(1);
    expect(unobserved.source1).not.toHaveBeenCalled();
    expect(unobserved.source2).not.toHaveBeenCalled();

    source1.next(11);
    expect(run1.updates.last).toBe(11);

    run1.dispose();
    expect(observed.source1).toHaveBeenCalledTimes(1);
    expect(observed.source2).toHaveBeenCalledTimes(1);
    expect(unobserved.source1).toHaveBeenCalledTimes(1);
    expect(unobserved.source2).toHaveBeenCalledTimes(1);

    source2.next(22);
    expect(readEffect(() => merged.value)).toBe(22);
  });
});
