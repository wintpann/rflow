import { combine, map, observable, pipe } from '../../again';

const text = observable('').api({
  change: (value: string) => value,
});

const count = observable(0).api((count) => ({
  increase: () => count() + 1,
}));

const trimmed = pipe(
  combine(text, count),
  map(([text, count]) => text.substring(0, count)),
);

window.text = text;
window.count = count;
window.trimmed = trimmed;

text.observe((v) => console.log('LOOOG text', v));
count.observe((v) => console.log('LOOOG count', v));
trimmed.observe((v) => console.log('LOOOG trimmed', v));

export const Starter = () => {
  return null;
};
