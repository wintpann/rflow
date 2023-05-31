import { Pipe } from './typings.ts';

export const die = (message: string) => {
  throw new Error(message);
};

export const debug = (event: string, source: string) => {
  console.log('\x1b[36m%s\x1b[0m', `REACTIVE[${event}]: ${source}`); // Cyan
};

export const noop = (): void => undefined;

export const pipe: Pipe = (value: any, ...fns: any) =>
  fns.reduce((val: any, fn: any) => fn(val), value);
