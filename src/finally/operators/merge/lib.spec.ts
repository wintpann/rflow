import { of } from '../../observable';
import { merge } from './lib.ts';

describe('combine', () => {
  it('should work', () => {
    const [text, count] = [of('text'), of(0)];
    const merged = merge(text, count);
    expect(merged()).toBe('text');

    text.next('next');
    expect(merged()).toStrictEqual('next');
    count.next(1);
    expect(merged()).toStrictEqual(1);
  });

  it('should init value from latest', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const text = of('text');
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:01:00.000Z'));
    const count = of(0);
    jest.useRealTimers();
    const merged = merge(text, count);
    expect(merged()).toStrictEqual(0);

    text.next('next');
    expect(merged()).toStrictEqual('next');
    count.next(1);
    expect(merged()).toStrictEqual(1);
  });
});
