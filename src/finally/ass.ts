/* eslint-disable */
// @ts-nocheck

const input = observable('').create({
  api: (next) => ({
    change: (value: string) => next(value),
  }),
});

const numbers = input.pipe(
  map((text) =>
    text
      .split(',')
      .map(Number)
      .filter((el) => !Number.isNaN(el)),
  ),
  debounceTime(300),
);

const todos = remote({
  params: numbers,
  request: (params, signal) => api.getTodos(params, signal),
  enabled: (params) => params.length > 0,
});

const pictureIds = todos.pipe(
  map(remote.toOption),
  map(
    option.fold(
      (value) => value.map((el) => el.pictureId),
      () => [],
    ),
  ),
);

const pictures = remote({
  params: pictureIds,
  request: (params, signal) => api.getPictures(params, signal),
  enabled: (params) => params.length > 0,
});
