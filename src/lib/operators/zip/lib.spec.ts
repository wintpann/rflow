import { of } from '../../observable';
import { zip } from './lib.ts';

describe('zip', () => {
  it('should work', () => {
    const [one, two] = [of(1), of(2)];
    const zipped = zip(one, two);
    expect(zipped()).toStrictEqual([1, 2]);

    one.next(11);
    expect(zipped()).toStrictEqual([1, 2]);
    two.next(22);
    expect(zipped()).toStrictEqual([11, 22]);

    one.next(111);
    expect(zipped()).toStrictEqual([11, 22]);
    one.next(1111);
    expect(zipped()).toStrictEqual([11, 22]);
    two.next(222);
    expect(zipped()).toStrictEqual([111, 222]);
    two.next(2222);
    expect(zipped()).toStrictEqual([1111, 2222]);

    two.next(22222);
    expect(zipped()).toStrictEqual([1111, 2222]);
    two.next(222222);
    expect(zipped()).toStrictEqual([1111, 2222]);
    one.next(11111);
    expect(zipped()).toStrictEqual([11111, 22222]);
    one.next(111111);
    expect(zipped()).toStrictEqual([111111, 222222]);
  });
});
