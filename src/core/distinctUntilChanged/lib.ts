import {
  IEqualsComparer,
  reaction,
  comparer as mobxComparer,
  toJS,
} from 'mobx';
import { Observable, createDerivation } from '../observable/lib.ts';
import { DistinctUntilChanged } from './typings.ts';

export const distinctUntilChanged: DistinctUntilChanged =
  <A>(comparer?: IEqualsComparer<A>) =>
  (source: Observable<A>): Observable<A> => {
    const store: { lastValue: A | undefined } = {
      lastValue: undefined,
    };

    const compare = comparer ?? mobxComparer.shallow;

    return createDerivation({
      deriver: () => {
        store.lastValue = toJS(source.value);
        return store.lastValue;
      },
      onObserved: (self, _state, controller) => {
        controller.derive();

        return reaction(
          () => toJS(source.value),
          (value) => {
            const equals = compare(store.lastValue!, value);
            if (!equals) {
              self.next(value);
            }

            store.lastValue = value;
          },
        );
      },
    });
  };
