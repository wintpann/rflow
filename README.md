currently in development. check mvp branch to see available example `yarn dev` 

```tsx
import { debounceTime, map, observable, observer, useModel } from 'rflow';

const createCounterModel = (initialCount: number) => {
  const counter = observable(initialCount).api((next) => ({
    increase: () => next(counter() + 1),
    decrease: () => next(counter() - 1),
  }));
  const debouncedCounter = counter.pipe(debounceTime(500));
  const isCountMoreThan10 = counter.pipe(map((count) => count > 10));
  const title = counter.pipe(
    map((count) => (count % 2 === 0 ? 'count is odd' : 'count is even')),
  );

  return {
    counter,
    debouncedCounter,
    title,
    isCountMoreThan10,
  };
};

const Counter = observer<{ initial: number }>(({ initial }) => {
  const { counter, debouncedCounter, isCountMoreThan10, title } = useModel(() =>
    createCounterModel(initial),
  );

  return (
    <div>
      <div>counter is: {counter()}</div>
      <div>debounced counter is: {debouncedCounter()}</div>
      <button onClick={counter.increase}>+</button>
      <button onClick={counter.decrease}>-</button>
      {isCountMoreThan10() && <div>{title()}</div>}
    </div>
  );
});

const App = () => {
  return <Counter initial={5} />;
};
```