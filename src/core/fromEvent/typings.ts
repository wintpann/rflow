import { Observable } from '../observable/lib.ts';

export type HasAddRemoveEventListener = {
  addEventListener: (...args: any[]) => any;
  removeEventListener: (...args: any[]) => any;
};

export interface FromEvent {
  <
    EventName extends keyof HTMLElementEventMap,
    EventType extends Event = HTMLElementEventMap[EventName],
  >(
    input: HTMLElement,
    eventName: EventName,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;

  <
    EventName extends keyof DocumentEventMap,
    EventType extends Event = DocumentEventMap[EventName],
  >(
    input: Document,
    eventName: EventName,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;

  <
    EventName extends keyof WindowEventMap,
    EventType extends Event = WindowEventMap[EventName],
  >(
    input: Window,
    eventName: EventName,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;

  <
    EventName extends keyof EventSourceEventMap,
    EventType extends Event = EventSourceEventMap[EventName],
  >(
    input: EventSource,
    eventName: EventName,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;

  <
    EventName extends keyof WebSocketEventMap,
    EventType extends Event = WebSocketEventMap[EventName],
  >(
    input: WebSocket,
    eventName: EventName,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;

  <EventType extends Event = Event>(
    input: HasAddRemoveEventListener,
    eventName: string,
    options?: boolean | AddEventListenerOptions,
  ): Observable<EventType | null>;
}
