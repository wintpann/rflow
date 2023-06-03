import { Of } from './typings.ts';
import { UnobservedHandler } from '../observable/typings.ts';
import { createObservable, Observable } from '../observable/lib.ts';

export const of: Of = <T>(
  value: T,
  onObserved?: (self: Observable<T>) => UnobservedHandler | void,
) =>
  createObservable(value, {
    onObserved: onObserved ? (self) => onObserved(self) : undefined,
  });
