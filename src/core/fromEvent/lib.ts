import { of } from '../of/lib.ts';
import { FromEvent, HasAddRemoveEventListener } from './typings.ts';
import { Observable } from '../observable/lib.ts';

export const fromEvent: FromEvent = (
  input: HasAddRemoveEventListener,
  eventName: string,
  options?: boolean | AddEventListenerOptions,
): Observable<Event | null> => {
  const out = of<Event | null>(null, () => {
    const listener = (event: any) => out.next(event);
    input.addEventListener(eventName, listener, options);

    return () => {
      input.removeEventListener(eventName, listener, options);
    };
  });

  return out;
};
