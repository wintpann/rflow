import {
  ContinualAPI,
  ContinualObservable,
  Next,
  Observable,
} from '../../observable';
import { Future } from '../future';

export type QueryKey = unknown[];

export type QueryOptions<Data, Error, Args> = {
  onRequest?: (args: Args) => void;
  onError?: (e: Error, args: Args) => void;
  onSuccess?: (data: Data, args: Args) => void;
  onSettled?: (value: Future<Data, Error>, args: Args) => void;
  refetchInterval?:
    | number
    | boolean
    | ((data: Data | null, args: Args) => boolean);
  retry?:
    | boolean
    | number
    | ((failureCount: number, error: Error, args: Args) => boolean);
  retryDelay?:
    | number
    | ((failureCount: number, error: Error, args: Args) => boolean);
  cacheTime?: number;
};

export type MutationOptions<Data, Error, Args> = Pick<
  QueryOptions<Data, Error, Args>,
  'onError' | 'onSuccess' | 'onSettled' | 'retry' | 'retryDelay' | 'onRequest'
>;

export interface QueryClient {
  isSuccess: (key: QueryKey) => boolean;
  isIdle: (key: QueryKey) => boolean;
  isPending: (key: QueryKey) => boolean;
  isFailure: (key: QueryKey) => boolean;
  getQuery: <Data, Error>(key: QueryKey) => Future<Data, Error>;
  setQuery: <Data, Error>(
    key: QueryKey,
    updater: Next<Future<Data, Error>>,
  ) => Future<Data, Error>;
  fetchQuery: <Data>(key: QueryKey) => Promise<Data>;
  cancelQuery: (key: QueryKey) => void;
  defaults: <Data, Error, Args>(params: {
    query: QueryOptions<Data, Error, Args>;
    mutation: MutationOptions<Data, Error, Args>;
  }) => void;
}

export type QueryParams<Data, Error, Args> = {
  fn: (args: Args, signal: AbortSignal) => Promise<Data>;
  key: (args: Args) => QueryKey;
  args?: Observable<Args, NonNullable<unknown>>;
  dependsOn?: ContinualObservable | ContinualObservable[];
  enabled?: (args: Args) => boolean;
  initialData?: Data;
} & QueryOptions<Data, Error, Args>;

export type QueryResult<Data, Error> = ContinualObservable<
  Future<Data, Error>,
  ContinualAPI & {
    isSuccess: () => boolean;
    isIdle: () => boolean;
    isPending: () => boolean;
    isFailure: () => boolean;
    setQuery: <Data, Error>(
      updater: Next<Future<Data, Error>>,
    ) => Future<Data, Error>;
    cancelQuery: () => void;
    fetchQuery: () => Promise<Data>;
  }
>;

export type Query = <Data, Error, Args>(
  params: QueryParams<Data, Error, Args>,
) => QueryResult<Data, Error>;

export type MutationParams<Data, Error, Args> = {
  fn: (args: Args, signal: AbortSignal) => Promise<Data>;
  key: (args: Args) => QueryKey;
} & MutationOptions<Data, Error, Args>;

export type MutationResult<Data, Error, Args> = ContinualObservable<
  Future<Data, Error>,
  ContinualAPI & {
    isSuccess: () => boolean;
    isIdle: () => boolean;
    isPending: () => boolean;
    isFailure: () => boolean;
    mutate: (args: Args) => Promise<Data>;
  }
>;

export type Mutation = <Data, Error, Args>(
  params: MutationParams<Data, Error, Args>,
) => MutationResult<Data, Error, Args>;
