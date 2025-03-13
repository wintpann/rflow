import * as Lib from '../lib';

Object.entries(Lib).forEach(([key, value]) => {
  // @ts-ignore
  window[key] = value;
});
