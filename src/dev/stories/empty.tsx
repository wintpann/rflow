import { autorun } from 'mobx';
import { useButtonControl } from 'storybox-react';

const start = () => {
  autorun(() => {
    console.log('AUTORUN');
  });
};

export const Empty = () => {
  useButtonControl({ name: 'start', onClick: start });
  return null;
};
