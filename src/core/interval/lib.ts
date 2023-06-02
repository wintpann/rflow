import { of } from '../of/lib.ts';
import { Interval } from './typings.ts';

export const interval: Interval = (
  delay: number,
  options?: { from?: number; immediateIncrement?: boolean; step?: number },
) => {
  const step = options?.step ?? 1;

  const out = of(options?.from ?? 0, () => {
    if (options?.immediateIncrement) {
      out.update((value) => value + step);
    }

    const timeout = setInterval(() => {
      out.update((value) => value + step);
    }, delay);

    return () => clearInterval(timeout);
  });

  return out;
};
