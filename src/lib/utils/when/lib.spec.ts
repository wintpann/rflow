import { when } from './lib.ts';
import { of } from '../../observable';
import { nextTick } from '../../test-utils.ts';
import { testTimeoutScheduler } from '../../scheduler';

jest.mock('../../scheduler', () => {
  const module = jest.requireActual('../../scheduler');
  return {
    ...module,
    timeoutScheduler: module.testTimeoutScheduler,
  };
});

describe('when', () => {
  it('should resolve', async () => {
    const source = of(0);
    let result = {
      resolved: false,
      rejected: false,
    };
    when(source, (v) => v === 3)
      .then(() => {
        result = {
          resolved: true,
          rejected: false,
        };
      })
      .catch(() => {
        result = {
          resolved: false,
          rejected: true,
        };
      });

    source.next(1);
    await nextTick();
    expect(result).toStrictEqual({
      resolved: false,
      rejected: false,
    });
    source.next(2);
    await nextTick();
    expect(result).toStrictEqual({
      resolved: false,
      rejected: false,
    });
    source.next(3);
    await nextTick();
    expect(result).toStrictEqual({
      resolved: true,
      rejected: false,
    });
  });

  it('should resolve immediately', async () => {
    const source = of(0);
    let result = {
      resolved: false,
      rejected: false,
    };
    when(source, (v) => v === 0)
      .then(() => {
        result = {
          resolved: true,
          rejected: false,
        };
      })
      .catch(() => {
        result = {
          resolved: false,
          rejected: true,
        };
      });

    await nextTick();
    expect(result).toStrictEqual({
      resolved: true,
      rejected: false,
    });
  });

  it('should resolve and clear timeout', async () => {
    const source = of(0);
    let result = {
      resolved: false,
      rejected: false,
    };
    when(source, (v) => v === 3, 1001)
      .then(() => {
        result = {
          resolved: true,
          rejected: false,
        };
      })
      .catch(() => {
        result = {
          resolved: false,
          rejected: true,
        };
      });

    source.next(3);
    await nextTick();
    expect(result).toStrictEqual({
      resolved: true,
      rejected: false,
    });
    expect(testTimeoutScheduler.isPresent(1001)).toBeFalsy();
  });

  it('should reject', async () => {
    const source = of(0);
    let result = {
      resolved: false,
      rejected: false,
    };
    when(source, (v) => v === 3, 1002)
      .then(() => {
        result = {
          resolved: true,
          rejected: false,
        };
      })
      .catch(() => {
        result = {
          resolved: false,
          rejected: true,
        };
      });

    source.next(1);
    testTimeoutScheduler.exec(1002);
    await nextTick();
    expect(result).toStrictEqual({
      resolved: false,
      rejected: true,
    });
  });
});
