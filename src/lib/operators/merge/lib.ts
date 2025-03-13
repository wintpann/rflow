import { observable, operate, Observable } from '../../observable';
import { Merge } from './typings.ts';

export const merge: Merge = (...sources: Observable[]): Observable => {
  const latest = sources.sort(
    (a, b) => b.updatedTimestamp - a.updatedTimestamp,
  )[0];
  return operate({
    destination: observable(latest()).api(),
    define: ({ next }) =>
      sources.map((observable) =>
        observable.observeSync((value) => next(value)),
      ),
  });
};
