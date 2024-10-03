import { Lazy } from '../../common';

const noop = () => void 0;

export type Todo = {
  id: number;
  title: string;
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomTodos = (): Todo[] => [
  { id: random(1, 10), title: String(random(1, 10)) },
  { id: random(1, 10), title: String(random(1, 10)) },
];

type Event = {
  type: 'fetch' | 'resolve' | 'reject' | 'abort';
  params?: any;
  result?: any;
  error?: Error;
};

export const last = <T>(array: T[]) => array[array.length - 1];

export const configure = () => {
  const events: Event[] = [];

  const promiseRef: { resolve: Lazy; reject: Lazy } = {
    resolve: noop,
    reject: noop,
  };

  const api = {
    getTodos: (params: any, signal: AbortSignal) =>
      new Promise<Todo[]>((resolve, reject) => {
        events.push({ type: 'fetch', params });
        promiseRef.resolve = () => {
          const result = randomTodos();
          events.push({ type: 'resolve', result });
          resolve(result);
        };
        promiseRef.reject = () => {
          const error = new Error('getTodos.failure');
          events.push({ type: 'resolve', error });
          reject(error);
        };

        signal.addEventListener('abort', () => {
          events.push({ type: 'abort' });
        });
      }),
  };

  const resolve = () => promiseRef.resolve();
  const reject = () => promiseRef.reject();

  return {
    api,
    events,
    resolve,
    reject,
  };
};
