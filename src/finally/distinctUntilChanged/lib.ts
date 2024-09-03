import equals from 'fast-deep-equal/es6';
import { EqualsComparer } from './typings.ts';
import { observable, Observable, introspect } from '../observable';

export const distinctUntilChanged =
  <T>(comparer?: EqualsComparer<T>) =>
  (source: Observable<T, NonNullable<unknown>>): Observable<T> => {
    const compare = comparer || equals;
    let lastValue = source();

    return observable(lastValue).create({
      reflect: {
        parent: source,
        onRead: ({ next, isObserved }) => {
          if (!isObserved() || introspect.hasUpdates(source)) {
            lastValue = source();
            next(lastValue, { scheduleUpdate: false });
          }
        },
        onBecomesObserved: ({ next }) => {
          lastValue = source();
          next(lastValue, { scheduleUpdate: false });
          return source.observe((v) => {
            const equals = compare(lastValue, v);
            if (!equals) {
              next(v);
            }
            lastValue = v;
          });
        },
      },
    });
  };
