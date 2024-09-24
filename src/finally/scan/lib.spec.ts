import { scan } from './lib.ts';
import { of } from '../observable';

describe('scan', () => {
  it('should work', () => {
    const source = of(2);
    const array = source.pipe(
      scan<number, number[]>((acc, curr) => [...acc, curr], []),
    );

    expect(source()).toBe(2);
    expect(array()).toStrictEqual([2]);

    source.next(4);
    expect(source()).toBe(4);
    expect(array()).toStrictEqual([2, 4]);
  });
});
