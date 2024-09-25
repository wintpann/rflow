import { observable, operate, Observable } from '../../observable';
import { Zip } from './typings.ts';

export const zip: Zip = (
  ...observables: Observable<any, NonNullable<unknown>>[]
): Observable<any> => {
  const stacks = observables.map((observable) => [observable()]);
  const shift = () => stacks.map((stack) => stack.shift());
  const canNext = () => stacks.every((stack) => stack.length > 0);

  return operate({
    destination: observable(shift()).create(),
    define: ({ next }) =>
      observables.map((observable, index) =>
        observable._unsafe.watch((value) => {
          stacks[index].push(value);
          if (canNext()) {
            next(shift());
          }
        }),
      ),
  });
};
