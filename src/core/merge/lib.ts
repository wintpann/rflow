import { createDerivation, Observable } from '../observable/lib.ts';
import { Merge } from './typings.ts';
import { die } from '../common/lib.ts';
import { reaction, toJS } from 'mobx';

export const merge: Merge = <A>(...observables: Observable<A>[]) => {
  if (observables.length < 2) {
    die('merge() accepts at least 2 observables');
  }

  const getLastUpdatedSource = () =>
    observables.reduce(
      (prev, current) =>
        prev.lastUpdatedTime > current.lastUpdatedTime ? prev : current,
      observables[0],
    );

  return createDerivation({
    deriver: () => toJS(getLastUpdatedSource().value),
    onObserved: (self) => {
      const disposers = observables.map((source) =>
        reaction(
          () => toJS(source.value),
          (value) => self.next(value),
        ),
      );

      return () => {
        disposers.forEach((dispose) => dispose());
      };
    },
  });
};
