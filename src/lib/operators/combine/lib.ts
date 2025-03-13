import {
  observable,
  operate,
  Observable,
  isObservable,
} from '../../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (
  first: any,
  ...rest: any[]
): Observable<any> => {
  const isStruct = !isObservable(first);
  const sources = isStruct
    ? (Object.values(first) as Observable<any>[])
    : ([first, ...rest] as Observable<any>[]);

  const value = () => {
    if (isStruct) {
      return Object.entries<Observable<any>>(first).reduce(
        (acc, [key, observable]) => ({ ...acc, [key]: observable() }),
        {},
      );
    }

    return sources.map((observable) => observable());
  };

  return operate({
    destination: observable(value()).api(),
    define: ({ next }) =>
      sources.map((observable) => observable.observeSync(() => next(value()))),
  });
};
