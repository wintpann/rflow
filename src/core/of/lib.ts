import { Of } from './typings.ts';
import { ObservedHandler } from '../observable/typings.ts';
import { createObservable } from '../observable/lib.ts';

export const of: Of = <T>(value: T, onObserved?: ObservedHandler) =>
  createObservable(value, { onObserved });
