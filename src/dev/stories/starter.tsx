import { observable } from '../../finally';

const count = observable(0).create({
  api: (next) => ({
    increase: () => next((prev) => prev + 1),
  }),
});

const text = observable('').create({
  api: (next) => ({
    change: (text: string) => next(text),
  }),
});

count.observe((value) => console.log('LOOOG count', value));
text.observe((value) => console.log('LOOOG text', value));

window.count = count;
window.text = text;

export const Starter = () => {
  return null;
};
