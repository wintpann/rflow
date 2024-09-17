/* eslint-disable */
// @ts-nocheck

const input = of('');

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
  request: (params, signal) =>
    params.length > 0 ? api.getTodos(params, signal) : false,
});

const pictureIds = todos.pipe(
  map(
    remote.foldS(
      (value) => value.map((el) => el.pictureId),
      () => [],
    ),
  ),
);

const pictures = remote({
  params: pictureIds,
  request: (params, signal) =>
    params.length > 0 ? api.getPictures(params, signal) : false,
});

const clicks = fromEvent(document, 'click');
const result = clicks.pipe(
  audit((ev) => interval(1000)),
  scan(),
);
