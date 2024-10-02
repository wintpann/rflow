import { FromEvent } from './typings.ts';
import { observable, Observable } from '../../observable';
import { critical, Lazy } from '../../common';

export const fromEvent: FromEvent = (
  first: any,
  second: any,
  third?: any,
): Observable<
  Event | null,
  { start: (input?: any) => void; stop: () => void }
> => {
  const [spotInput, eventName, options] =
    typeof first === 'string' ? [null, first, second] : [first, second, third];
  let disposers: Lazy[] = [];

  return observable<Event | null>(null).create((next) => ({
    start: (delayedInput) => {
      const input = spotInput ?? delayedInput;
      const source = input instanceof Function ? input() : input;
      if (!source) {
        critical('fromEvent input missing');
        return () => false;
      }
      const listener = (event: Event) => next(event);
      source.addEventListener(eventName, listener, options);
      disposers.push(() =>
        source.removeEventListener(eventName, listener, options),
      );
    },
    stop: () => {
      disposers.forEach((dispose) => dispose());
      disposers = [];
    },
  }));
};
