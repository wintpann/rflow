// import { FromEvent } from './typings.ts';
// import { observable, Observable, UnobserveFunction } from '../../observable';
//
// export const fromEvent: FromEvent = (
//   first: any,
//   second: any,
//   third?: any,
// ): Observable<Event | null, { listen: (input?: any) => UnobserveFunction }> => {
//   const [spotInput, eventName, options] =
//     typeof first === 'string' ? [null, first, second] : [first, second, third];
//
//   return observable<Event | null>(null).api((next) => ({
//     listen: (delayedInput) => {
//       const input = spotInput ?? delayedInput;
//       const source = input instanceof Function ? input() : input;
//       if (!source) {
//         console.error('fromEvent input missing');
//         return () => false;
//       }
//       const listener = (event: Event) => next(event);
//       source.addEventListener(eventName, listener, options);
//       return () => source.removeEventListener(eventName, listener, options);
//     },
//   }));
// };
