import { fromEvent } from './lib.ts';
import { readEffect, runEffect } from '../test-utils.ts';

describe('fromEvent', () => {
  it('should create from any object with add/remove eventListener', () => {
    let currentCallback: ((data: any) => void) | undefined;

    const addEventListener = jest.fn((_, callback) => {
      currentCallback = callback;
    });
    const removeEventListener = jest.fn(() => {
      currentCallback = undefined;
    });

    const source = fromEvent(
      {
        addEventListener,
        removeEventListener,
      },
      'event-name',
    );

    expect(readEffect(() => source.value)).toBe(null);
    expect(currentCallback).toBe(undefined);

    const run1 = runEffect(() => source.value);
    expect(run1.updates.last).toBe(null);
    expect(currentCallback).not.toBe(undefined);

    currentCallback?.('data');
    expect(run1.updates.last).toBe('data');

    run1.dispose();
    expect(currentCallback).toBe(undefined);
  });
});
