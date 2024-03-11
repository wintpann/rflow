import { Observable } from './observable';

export const observe = <T>(observable: Observable<T>) => {
  const updates = {
    current: [] as T[],
    get last() {
      return updates.current[updates.current.length - 1];
    },
  };

  const dispose = observable.observe((value) => {
    updates.current.push(value);
  });

  return { updates, dispose };
};

export const read = <T>(observable: Observable<T>) => observable();
