import { observable } from '../../again';

const text = observable('text', {
  change: (value: string) => value,
});

const repeatCount = observable(0, {
  increase: () => 1,
});

window.text = text;
window.repeatCount = repeatCount;

export const Starter = () => {
  return null;
};
