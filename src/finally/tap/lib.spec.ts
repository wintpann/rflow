import { of } from '../observable';
import { tap } from './lib.ts';

describe('tap', () => {
  it('should work', () => {
    const updates: number[] = [];
    const source = of(2);
    const tapped = source.pipe(tap((v) => updates.push(v)));
    expect(tapped).toBe(source);
    source.next(3);
    source.next(4);
    expect(updates).toStrictEqual([3, 4]);
  });
});
