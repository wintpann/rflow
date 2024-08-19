import { combine, map, observable } from '../../finally';

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

const trimmed = combine({ text, count }).pipe(
  map(({ text, count }) => text.substring(0, count)),
);

count.observe((value) => console.log('LOOOG count', value));
text.observe((value) => console.log('LOOOG text', value));
trimmed.observe((value) => console.log('LOOOG trimmed', value));

window.trimmed = trimmed;
window.count = count;
window.text = text;

export const Starter = () => {
  return null;
};
