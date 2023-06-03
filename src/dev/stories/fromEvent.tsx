import { autorun } from 'mobx';
import { useButtonControl } from 'storybox-react';
import { fromEvent, map } from '../../core';

const start = () =>
  setTimeout(() => {
    const source = fromEvent(document, 'click');
    autorun(() => {
      console.log('AUTORUN source.value >>', source.value);
    });

    const target = source.pipe(map((v) => v?.target ?? null));

    autorun(() => {
      console.log('AUTORUN target.value >>', target.value);
    });
  });

export const FromEvent = () => {
  useButtonControl({ name: 'start', onClick: start });
  return null;
};
