import { observable, operate, Observable } from '../../observable';
import { Zip } from './typings.ts';

export const zip: Zip = (...sources: Observable[]): Observable => {
  const stacks = sources.map((source) => [source()]);
  const shift = () => stacks.map((stack) => stack.shift());
  const canShift = () => stacks.every((stack) => stack.length > 0);

  return operate({
    destination: observable(shift()).api(),
    define: ({ next }) =>
      sources.map((observable, index) =>
        observable.observeSync((value) => {
          stacks[index].push(value);
          if (canShift()) {
            next(shift());
          }
        }),
      ),
  });
};
