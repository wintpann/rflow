import {
  observable,
  operate,
  Observable,
  isObservable,
} from '../../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (
  first: Observable,
  ...rest: Observable[]
): Observable => {
  const isStruct = !isObservable(first);
  const sources: Observable[] = isStruct
    ? Object.values(first)
    : [first, ...rest];

  const value = () => {
    if (isStruct) {
      return Object.entries<Observable>(first).reduce(
        (acc, [key, observable]) => ({ ...acc, [key]: observable() }),
        {},
      );
    }

    return sources.map((source) => source());
  };

  return operate({
    destination: observable(value()).api(),
    define: ({ next }) =>
      sources.map((observable) => observable.observeSync(() => next(value()))),
  });
};
