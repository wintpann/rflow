import { observable, operate, Observable } from '../../observable';
import { Merge } from './typings.ts';

export const merge: Merge = (
  ...observables: Observable<any, NonNullable<unknown>>[]
): Observable<any> => {
  const latest = observables.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  return operate({
    destination: observable(latest()).create(),
    define: ({ next }) =>
      observables.map((observable) =>
        observable._unsafe.watch((value) => next(value)),
      ),
  });
};
