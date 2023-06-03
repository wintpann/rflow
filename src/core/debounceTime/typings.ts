import { Observable } from '../observable/lib.ts';

export type DebounceSettings = {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
};

export interface DebounceTime {
  <T>(time: number, options?: DebounceSettings): (
    source: Observable<T>,
  ) => Observable<T>;
}
