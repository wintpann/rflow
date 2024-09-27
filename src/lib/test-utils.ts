import { Observable } from './observable';

export const observe = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
) => {
  const updates = {
    current: [] as Value[],
    get last() {
      return updates.current[updates.current.length - 1];
    },
  };

  const dispose = observable.observe((value) => {
    updates.current.push(value);
  });

  return { updates, dispose };
};

export const watch = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
) => {
  const updates = {
    current: [] as Value[],
    get last() {
      return updates.current[updates.current.length - 1];
    },
  };

  const dispose = observable._unsafe.watch((value) => {
    updates.current.push(value);
  });

  return { updates, dispose };
};

export const read = <Value>(
  observable: Observable<Value, NonNullable<unknown>>,
) => observable();
