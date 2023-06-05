import { comparer, reaction, toJS, untracked } from 'mobx';
import { createDerivation, Observable } from '../observable/lib.ts';
import { die } from '../common/lib.ts';
import { Take } from './typings.ts';

export const take: Take =
  <A>(count: number) =>
  (source: Observable<A>): Observable<A> => {
    if (count < 0) {
      die('take() cannot get negative count');
    }

    const store: {
      lastValue: A;
      updatesCount: number;
      sourceTimesUpdated: number;
    } = {
      lastValue: untracked(() => toJS(source.value)),
      updatesCount: 0,
      sourceTimesUpdated: source.timesUpdated,
    };

    return createDerivation({
      deriver: () => {
        if (store.updatesCount >= count) {
          return store.lastValue;
        }

        const newValue = toJS(source.value);
        const sourceUpdated = source.timesUpdated > store.sourceTimesUpdated;
        const equalToLast = comparer.identity(newValue, store.lastValue);
        if (!sourceUpdated || equalToLast) {
          return store.lastValue;
        }

        store.updatesCount++;
        store.lastValue = newValue;
        return store.lastValue;
      },
      onObserved: (self, _state, controller) => {
        controller.derive();

        if (store.updatesCount >= count) {
          return;
        }

        const dispose = reaction(
          () => toJS(source.value),
          (value) => {
            store.lastValue = value;
            store.updatesCount++;
            self.next(value);

            if (store.updatesCount >= count) {
              dispose();
            }
          },
        );

        return dispose;
      },
    });
  };
