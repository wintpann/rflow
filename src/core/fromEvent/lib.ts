import { of } from '../of/lib.ts';
import { FromEvent, HasAddRemoveEventListener } from './typings.ts';
import { Observable } from '../observable/lib.ts';

export const fromEvent: FromEvent = (
  input: HasAddRemoveEventListener,
  eventName: string,
  options?: boolean | AddEventListenerOptions,
): Observable<Event | null> =>
  of<Event | null>(null, (self) => {
    const listener = (event: any) => self.next(event);
    input.addEventListener(eventName, listener, options);

    return () => {
      input.removeEventListener(eventName, listener, options);
    };
  });
