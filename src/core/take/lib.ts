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

    const ref: {
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
        if (ref.updatesCount >= count) {
          return ref.lastValue;
        }

        const newValue = toJS(source.value);
        const sourceUpdated = source.timesUpdated > ref.sourceTimesUpdated;
        const equalToLast = comparer.identity(newValue, ref.lastValue);
        if (!sourceUpdated || equalToLast) {
          return ref.lastValue;
        }

        ref.updatesCount++;
        ref.lastValue = newValue;
        return ref.lastValue;
      },
      onObserved: (self, _state, controller) => {
        controller.derive();

        if (ref.updatesCount >= count) {
          return;
        }

        const dispose = reaction(
          () => toJS(source.value),
          (value) => {
            ref.lastValue = value;
            ref.updatesCount++;
            self.next(value);

            if (ref.updatesCount >= count) {
              dispose();
            }
          },
        );

        return dispose;
      },
    });
  };
