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

    const unobserveSync = source.observeSync((value) => {
      if (predicate(value)) {
        unobserveSync();
        timeoutScheduler.clear(timeoutID);
        resolve();
      }
    });
    const timeoutID =
      timeout !== Infinity
        ? timeoutScheduler.schedule(() => {
            reject();
            unobserveSync();
          }, timeout)
        : undefined;
  });
