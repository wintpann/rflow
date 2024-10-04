import { Observable } from '../../observable';
import { timeoutScheduler } from '../../scheduler';

export const when = <T>(
  source: Observable<T, NonNullable<unknown>>,
  predicate: (value: T) => boolean,
  timeout: number = Infinity,
) =>
  new Promise<void>((resolve, reject) => {
    if (predicate(source())) {
      resolve();
      return;
    }

    const unwatch = source._unsafe.watch((value) => {
      if (predicate(value)) {
        unwatch();
        timeoutScheduler.clear(timeoutID);
        resolve();
      }
    });
    const timeoutID =
      timeout !== Infinity
        ? timeoutScheduler.schedule(() => {
            reject();
            unwatch();
          }, timeout)
        : undefined;
  });
