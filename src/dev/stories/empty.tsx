import { autorun } from 'mobx';
import { useButtonControl } from 'storybox-react';

const start = () => {
  autorun(() => {

  });
};

export const Empty = () => {
  useButtonControl({ name: 'start', onClick: start });
  return null;
};
