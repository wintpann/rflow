import { Observable, UnobserveFunction } from '../../observable';
import { Lazy } from '../../common';

export type HasAddRemoveEventListener = {
  addEventListener: (...args: any[]) => any;
  removeEventListener: (...args: any[]) => any;
};

export type UseCapture = boolean;

export interface FromEvent {
  <
    EventName extends keyof DocumentEventMap,
    EventType extends Event = DocumentEventMap[EventName],
  >(
    input: Document,
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <
    EventName extends keyof WindowEventMap,
    EventType extends Event = WindowEventMap[EventName],
  >(
    input: Window,
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <
    EventName extends keyof HTMLElementEventMap,
    EventType extends Event = HTMLElementEventMap[EventName],
  >(
    input: HTMLElement | Lazy<HTMLElement>,
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <
    EventName extends keyof HTMLElementEventMap,
    EventType extends Event = HTMLElementEventMap[EventName],
  >(
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<
    EventType | null,
    { listen: (input: HTMLElement) => UnobserveFunction }
  >;

  <
    EventName extends keyof EventSourceEventMap,
    EventType extends Event = EventSourceEventMap[EventName],
  >(
    input: EventSource | Lazy<EventSource>,
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <
    EventName extends keyof EventSourceEventMap,
    EventType extends Event = EventSourceEventMap[EventName],
  >(
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<
    EventType | null,
    { listen: (input: EventSource) => UnobserveFunction }
  >;

  <
    EventName extends keyof WebSocketEventMap,
    EventType extends Event = WebSocketEventMap[EventName],
  >(
    input: WebSocket | Lazy<WebSocket>,
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <
    EventName extends keyof WebSocketEventMap,
    EventType extends Event = WebSocketEventMap[EventName],
  >(
    eventName: EventName,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<
    EventType | null,
    { listen: (input: WebSocket) => UnobserveFunction }
  >;

  <EventType extends Event = Event>(
    input: HasAddRemoveEventListener | Lazy<HasAddRemoveEventListener>,
    eventName: string,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<EventType | null, { listen: () => UnobserveFunction }>;

  <EventType extends Event = Event>(
    eventName: string,
    options?: UseCapture | AddEventListenerOptions,
  ): Observable<
    EventType | null,
    { listen: (input: HasAddRemoveEventListener) => UnobserveFunction }
  >;
}
