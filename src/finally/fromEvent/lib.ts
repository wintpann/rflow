import { FromEvent } from './typings.ts';
import { observable, Observable, UnobserveFunction } from '../observable';
import { critical } from '../common';

export const fromEvent: FromEvent = (
  first: any,
  second: any,
  third?: any,
): Observable<Event | null, { listen: (input?: any) => UnobserveFunction }> => {
  const [spotInput, eventName, options] =
    typeof first === 'string' ? [null, first, second] : [first, second, third];

  return observable<Event | null>(null).create((next) => ({
    listen: (delayedInput) => {
      const input = spotInput ?? delayedInput;
      const source = input instanceof Function ? input() : input;
      if (!source) {
        critical('fromEvent input missing');
        return () => false;
      }
      const listener = (event: Event) => next(event);
      source.addEventListener(eventName, listener, options);
      return () => source.removeEventListener(eventName, listener, options);
    },
  }));
};
