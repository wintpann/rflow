import { IEqualsComparer } from 'mobx';
import { Observable } from '../observable/lib.ts';

export interface DistinctUntilChanged {
  <T>(comparer?: IEqualsComparer<T>): (source: Observable<T>) => Observable<T>;
}
