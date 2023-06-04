import { Observable } from '../observable/lib.ts';

export interface Take {
  <A>(count: number): (source: Observable<A>) => Observable<A>;
}
