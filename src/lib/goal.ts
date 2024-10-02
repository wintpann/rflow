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
  args: ids,
  dependsOn: [images],
  key: (ids) => ['todos', ids],
  enabled: (ids) => ids.length > 0,
  fn: (ids, signal) => api.getPictures(params, signal),
  refetchInterval: 200 | false | (({ args, data }) => false),
  onError: (e) => {},
  onSuccess: (data) => {},
  initialData: null,
  retry: boolean | number | ((failureCount: number, error: E) => boolean),
  retryDelay: number | ((failureCount: number, error: E) => number),
  cacheTime: number,
});
