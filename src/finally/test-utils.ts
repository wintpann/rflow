import { APIRecord, Observable } from './observable';

export const observe = <Value, API extends APIRecord>(
  observable: Observable<Value, API>,
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

export const read = <Value, API extends APIRecord>(
  observable: Observable<Value, API>,
) => observable();
