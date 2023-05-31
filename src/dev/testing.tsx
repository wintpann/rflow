import { autorun } from 'mobx';
import { createObservable } from '../core/observable/lib.ts';
import { useButtonControl } from 'storybox-react';

const log: typeof console.log = (...args) => console.log('REACTIVE[DEBUG]', ...args)

const testCreateObservable = () => {
  const observable = createObservable('');
  log('observable.value', observable.value);
  observable.next('1');
  observable.next(p => p+'1')
  observable.value+='1';
  autorun(() => {
    log('AUTORUN observable.value >>', observable.value)
  })
  observable.next('2');
  observable.next(p => p+'2')
  observable.value+='2';
};

export const Testing = () => {
  useButtonControl({ name: 'createObservable', onClick: testCreateObservable });
  return <div></div>;
};
