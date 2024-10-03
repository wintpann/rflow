/* eslint-disable */
// @ts-nocheck

const input = of('');

const textToIds = (text) =>
  text
    .split(',')
    .map(Number)
    .filter((el) => !Number.isNaN(el));

const ids = input.pipe(map(textToIds), debounceTime(300));

const todos = query({
  params: ids,
  request: (ids, signal) =>
    ids.length > 0 ? api.getTodos(params, signal) : false,
});

const pictureIds = todos.pipe(
  future.match(
    (todos) => todos.map(({ pictureId }) => pictureId),
    () => [],
  ),
);

const pictures = query({
  variables: pictureIds,
  dependsOn: [todos],
  request: (ids, signal) =>
    ids.length > 0 ? api.getPictures(params, signal) : false,
});

const App = () => {
  const data = useQuery(pictures);
};

// ============================

const todos = query({
  fn: (ids, signal) => api.getPictures(params, signal),
  key: (ids) => ['todos', ids],
  args: ids,
  dependsOn: [images],
  enabled: (ids) => ids.length > 0,
  initialData: null,
  onRequest: (ids) => {},
  onError: (e) => {},
  onSuccess: (data) => {},
  onSettled: (value, args) => {},
  refetchInterval: 200 | false | (({ args, data }) => false),
  retry: boolean | number | ((failureCount: number, error: E) => boolean),
  retryDelay: number | ((failureCount: number, error: E) => number),
  cacheTime: number,
});

const addTodo = mutation({
  fn: (text, signal) => api.addTodo(text, signal),
  key: (text) => ['add-todo', text],
  onError: (e) => {},
  onSuccess: (data) => {},
  onSettled: (data) => {},
  onRequest: (args) => {},
  retry: boolean | number | ((failureCount: number, error: E) => boolean),
  retryDelay: number | ((failureCount: number, error: E) => number),
});

queryClient.set(
  ['cart-count'],
  future.map((s) => s + 1),
);

import { queryClient } from 'x-state';
queryClient.defaults({
  mutation: {
    retry: 2000,
  },
});
