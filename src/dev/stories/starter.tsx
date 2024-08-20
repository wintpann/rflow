import { combine, map, of } from '../../finally';

const count = of(1);
const text = of('1');
const doubled = count.pipe(map((v) => v * 2));
const combined = combine({ text, count });

count.observe((value) => console.log('LOOOG count', value));
text.observe((value) => console.log('LOOOG text', value));
doubled.observe((value) => console.log('LOOOG doubled', value));
combined.observe((value) => console.log('LOOOG combined', value));

window.doubled = doubled;
window.combined = combined;
window.count = count;
window.text = text;

export const Starter = () => {
  return null;
};
