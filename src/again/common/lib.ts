import { Pipe } from './typings.ts';

export const die = (message: string) => {
  throw new Error(message);
};

export const pipe: Pipe = (value: any, ...fns: any) =>
  fns.reduce((val: any, fn: any) => fn(val), value);
