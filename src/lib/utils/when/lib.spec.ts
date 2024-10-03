import { when } from './lib.ts';
import { of } from '../../observable';
import { nextTick } from '../../test-utils.ts';

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

  it('should reject', async () => {
    const original = global.setTimeout;
    let run = () => void 0;
    // @ts-ignore
    global.setTimeout = jest.fn((cb) => {
      run = cb;
    });

    const source = of(0);
    let result = {
      resolved: false,
      rejected: false,
    };
    when(source, (v) => v === 3, 1000)
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
    run();
    await nextTick();
    expect(result).toStrictEqual({
      resolved: false,
      rejected: true,
    });

    global.setTimeout = original;
  });
});
