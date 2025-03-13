import { observable, operate, Observable } from '../../observable';
import { Merge } from './typings.ts';

export const merge: Merge = (
  ...observables: Observable<any, NonNullable<unknown>>[]
): Observable<any> => {
  const latest = observables.sort(
    (a, b) => b.updatedTimestamp - a.updatedTimestamp,
  )[0];
  return operate({
    destination: observable(latest()).api(),
    define: ({ next }) =>
      observables.map((observable) =>
        observable.observeSync((value) => next(value)),
      ),
  });
};
