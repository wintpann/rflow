import { observable, operate, Observable } from '../observable';
import { Combine } from './typings.ts';

export const combine: Combine = (...items: any[]): Observable<any> => {
  const isStruct = typeof items[0] === 'object' && items[0] !== null;
  const observables = isStruct
    ? (Object.values(items[0]) as Observable<any>[])
    : (items as Observable<any>[]);

  const value = () =>
    isStruct
      ? Object.entries<Observable<any>>(items[0]).reduce(
          (acc, [key, observable]) => ({
            ...acc,
            [key]: observable(),
          }),
          {},
        )
      : observables.map((observable) => observable());

  return operate({
    destination: observable(value()).create(),
    define: ({ next }) =>
      observables.map((observable) =>
        observable._unsafe.watch(() => next(value())),
      ),
  });
};
