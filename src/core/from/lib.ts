import { of } from '../of/lib.ts';
import { From } from './typings.ts';
import {
  createDerivation,
  createObservable,
  Observable,
} from '../observable/lib.ts';
import { die } from '../common/lib.ts';

const fromObservable = <A>(source: Observable<A>): Observable<A> =>
  createDerivation({
    interceptor: () => source.value,
  });

const fromIterable = <A>(
  iterable: Iterable<A>,
  delay: number,
): Observable<A> => {
  let currentIndex = 1;

  const array = Array.from(iterable);
  const outOfBoundsIndex = array.length;

  if (array.length === 0) {
    die('from() only takes iterable with at least one item');
  }

  return of(array[0], (self) => {
    const interval = setInterval(() => {
      if (currentIndex === outOfBoundsIndex) {
        clearInterval(interval);
      } else {
        self.next(array[currentIndex++]);
      }
    }, delay);

    return () => clearInterval(interval);
  });
};

const fromAsyncIterable = <A>(
  iterable: AsyncIterable<A>,
  initial: A,
): Observable<A> => {
  const store: {
    iterator: AsyncIterator<A>;
    done: boolean;
    lastValue?: A;
    haveUnAppliedLastValue: boolean;
  } = {
    iterator: iterable[Symbol.asyncIterator](),
    done: false,
    lastValue: undefined,
    haveUnAppliedLastValue: false,
  };

  return createObservable(initial, {
    onObserved: (self, state) => {
      if (store.haveUnAppliedLastValue && store.lastValue) {
        // TODO <A> can be undefined
        self.next(store.lastValue);
      }

      const nextIteration = () => {
        if (!store.done) {
          store.iterator.next().then((value) => {
            if (value.done) {
              store.done = true;
              return;
            } else {
              store.lastValue = value.value;
            }

            if (state.observed) {
              self.next(value.value);
              nextIteration();
            } else {
              store.haveUnAppliedLastValue = true;
            }
          });
        }
      };

      nextIteration();
    },
  });
};

export const from = ((input: any, arg1?: any) => {
  if (input[Symbol.iterator]) {
    return fromIterable(input, arg1);
  }

  if (input[Symbol.asyncIterator]) {
    return fromAsyncIterable(input, arg1);
  }

  if (input instanceof Observable) {
    return fromObservable(input);
  }

  die('from() unsupported type of input');
}) as unknown as From;
