// @ts-nocheck
import * as O from '../../finally';

const one = O.of(1);
const two = O.of(2);
const three = O.of(3);
const zipped = O.zip(one, two, three);

zipped.observe((v) => console.log('LOOOG', v));

Object.entries(O).forEach(([key, value]) => {
  window[key] = value;
});

export const Starter = () => {
  return null;
};
