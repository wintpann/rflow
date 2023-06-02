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

  const out = of(array[0], () => {
    const interval = setInterval(() => {
      if (currentIndex === outOfBoundsIndex) {
        clearInterval(interval);
      } else {
        out.next(array[currentIndex++]);
      }
    }, delay);

    return () => clearInterval(interval);
  });

  return out;
};

const fromAsyncIterable = <A>(
  iterable: AsyncIterable<A>,
  initial: A,
): Observable<A> => {
  const ref: {
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

  const out = createObservable(initial, {
    onObserved: (state) => {
      if (ref.haveUnAppliedLastValue && ref.lastValue) {
        out.next(ref.lastValue);
      }

      const nextIteration = () => {
        if (!ref.done) {
          ref.iterator.next().then((value) => {
            if (value.done) {
              ref.done = true;
              return;
            } else {
              ref.lastValue = value.value;
            }

            if (state.observed) {
              out.next(value.value);
              nextIteration();
            } else {
              ref.haveUnAppliedLastValue = true;
            }
          });
        }
      };

      nextIteration();
    },
  });

  return out;
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
