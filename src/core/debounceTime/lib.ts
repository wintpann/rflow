import { reaction, toJS } from 'mobx';
import { debounce } from 'lodash-es';
import { createDerivation, Observable } from '../observable/lib.ts';
import { DebounceSettings, DebounceTime } from './typings.ts';

export const debounceTime: DebounceTime =
  <A>(time: number, options?: DebounceSettings) =>
  (source: Observable<A>): Observable<A> =>
    createDerivation({
      deriver: () => toJS(source.value),
      onObserved: (self, _state, controller) => {
        controller.derive();

        return reaction(
          () => toJS(source.value),
          debounce((value) => self.next(value), time, options),
        );
      },
    });
