import { ContinualObservable, Next, Observable } from '../../observable';
import { Future } from '../future';

export type QueryKey = unknown[];

export interface QueryClient {
  isSuccess: (key: QueryKey) => boolean;
  isIdle: (key: QueryKey) => boolean;
  isPending: (key: QueryKey) => boolean;
  isFailure: (key: QueryKey) => boolean;
  get: <Data, Error>(key: QueryKey) => Future<Data, Error>;
  set: <Data, Error>(
    key: QueryKey,
    updater: Next<Future<Data, Error>>,
  ) => Future<Data, Error>;
  invalidate: (key: QueryKey) => void;
  fetch: (key: QueryKey) => void;
}

export type QueryParams<
  Data,
  Error,
  Args extends Observable<any, NonNullable<unknown>>,
> = {
  fn: (args: Args, signal: AbortSignal) => Promise<Data>;
  args?: Args;
  dependsOn?: ContinualObservable | ContinualObservable[];
  key: (args: Args) => QueryKey;
  enabled?: (args: Args) => boolean;
  refetchInterval?:
    | number
    | boolean
    | ((ctx: { args: Args; data?: Data }) => boolean);
  onError?: (e: Error) => void;
  onSuccess?: (data: Data) => void;
  initialData?: Data;
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
  retryDelay?: number | ((failureCount: number, error: Error) => boolean);
  cacheTime?: number;
};

export type Query = <
  Data,
  Error,
  Args extends Observable<any, NonNullable<unknown>>,
>(
  params: QueryParams<Data, Error, Args>,
) => ContinualObservable<Data>;
