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

const count1 = fromStorage(0).create((next) => ({
  increment: () => next((prev) => prev + 1),
}));

const count2 = observable(0)
  .create((next) => ({ increment: () => next((prev) => prev + 1) }))
  .pipe(storage());

const name = of('');
const greeting = input.pipe(map((name) => `Hello, ${name}!`));
const user = query({
  fn: (name) => api.getUser(name, signal),
  key: (name) => ['user', name],
  args: name.pipe(debounceTime(200)),
  enabled: (name) => !!name,
});

export const Greeting = observer(() => {
  return (
    <>
      <input value={input()} onChange={(e) => name.next(e.target.value)} />
      {greeting()}
      {user().data}
    </>
  );
});
