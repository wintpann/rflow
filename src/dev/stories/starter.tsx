import { observable } from '../../again';

const text = observable('text').api({
  change: (value) => value,
});

const lettersCount = observable(0).api({
  set: () => lettersCount(),
});

window.text = text;

export const Starter = () => {
  return null;
};
