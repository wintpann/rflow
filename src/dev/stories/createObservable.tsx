import { autorun } from 'mobx';
import { createObservable } from '../../core/observable/lib.ts';
import { useButtonControl } from 'storybox-react';

const start = () => {
  const observable = createObservable('0');
  console.log('observable.value', observable.value);

  observable.next('1');
  observable.update((p) => p + '1');

  autorun(() => {
    console.log('AUTORUN observable.value >>', observable.value);
  });

  observable.next('2');
  observable.update((p) => p + '2');
};

export const CreateObservable = () => {
  useButtonControl({ name: 'start', onClick: start });
  return null;
};
