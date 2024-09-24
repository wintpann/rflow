import equals from 'fast-deep-equal/es6';
import { EqualsComparer } from './typings.ts';
import { observable, Observable, operate } from '../observable';

export const distinctUntilChanged =
  <T>(comparer?: EqualsComparer<T>) =>
  (source: Observable<T, NonNullable<unknown>>): Observable<T> => {
    const compare = comparer || equals;
    let lastValue = source();

    return operate({
      destination: observable(lastValue).create(),
      define: ({ next }) =>
        source._unsafe.watch((value) => {
          const equals = compare(lastValue, value);
          if (!equals) {
            next(value);
          }
          lastValue = value;
        }),
    });
  };
