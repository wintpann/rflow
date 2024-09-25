import * as O from '../finally';

const expose = (object: any) =>
  Object.entries(object).forEach(([key, value]) => {
    // @ts-ignore
    window[key] = value;
  });
expose(O);

expose({});

export const Starter = () => {
  return null;
};
