import { useState } from 'react';
import { debounceTime, map, observable } from '../lib';
import { observer } from '../lib/react';

const createCounterModel = (initial: number) => {
  const counter = observable(initial).api((next) => ({
    increase: () => next((prev) => prev + 1),
    decrease: () => next((prev) => prev - 1),
  }));
  const debouncedCounter = counter.pipe(debounceTime(500));
  const showTitle = counter.pipe(map((count) => count > 10));
  const title = counter.pipe(
    map((count) => (count % 2 === 0 ? 'count is odd' : 'count is even')),
  );
  return {
    counter,
    debouncedCounter,
    title,
    showTitle,
  };
};

const Counter = observer<{ initial: number }>(({ initial }) => {
  const [model] = useState(() => createCounterModel(initial));

  return (
    <div>
      <div>counter is: {model.counter()}</div>
      <div>debounced counter is: {model.debouncedCounter()}</div>
      <button onClick={model.counter.increase}>+</button>
      <button onClick={model.counter.decrease}>-</button>
      {model.showTitle() && <div>{model.title()}</div>}
    </div>
  );
});

const App = () => {
  return <Counter initial={5} />;
};

export const Starter = () => {
  return <App />;
};
