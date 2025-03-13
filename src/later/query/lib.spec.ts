// import { query } from './lib.ts';
// import { configure, last, randomTodos } from './spec-utils.ts';
// import { future } from '../../../later/future';
// import { when } from '../../utils';
// import { of } from '../../observable';
// import { nextTick } from '../../test-utils.ts';
//
// describe('query', () => {
//   it('should fetch base default case', async () => {
//     const { api, resolve, events } = configure();
//
//     const todos = query({
//       fn: api.getTodos,
//       key: () => ['todos'],
//     });
//
//     expect(todos()).toStrictEqual(future.idle());
//
//     todos.fetchQuery();
//     expect(events).toStrictEqual([{ type: 'fetch', params: undefined }]);
//     expect(todos()).toStrictEqual(future.pending());
//
//     resolve();
//     await when(todos, future.isSuccess);
//     expect(events).toStrictEqual([
//       { type: 'fetch', params: undefined },
//       { type: 'resolve', result: todos().data },
//     ]);
//   });
//
//   it('should notice already running same query', async () => {
//     const { api, events, resolve } = configure();
//
//     const todos1 = query({
//       fn: api.getTodos,
//       key: () => ['todos'],
//     });
//     const todos2 = query({
//       fn: api.getTodos,
//       key: () => ['todos'],
//     });
//
//     todos1.fetchQuery();
//     todos2.fetchQuery();
//     expect(events).toStrictEqual([{ type: 'fetch', params: undefined }]);
//
//     resolve();
//     await Promise.all([
//       when(todos1, future.isSuccess),
//       when(todos2, future.isSuccess),
//     ]);
//     expect(events).toStrictEqual([
//       { type: 'fetch', params: undefined },
//       { type: 'resolve', result: todos1().data },
//     ]);
//     expect(todos1()).toStrictEqual(todos2());
//   });
//
//   it('should fetch with args', () => {
//     const { api, events, resolve } = configure();
//
//     const todos = query({
//       args: of(1),
//       fn: api.getTodos,
//       key: (args) => ['todos', args],
//     });
//
//     expect(todos()).toStrictEqual(future.idle());
//
//     todos.fetchQuery();
//     expect(events).toStrictEqual([{ type: 'fetch', params: 1 }]);
//     resolve();
//   });
//
//   it('should work with enabled param', () => {
//     const { api, events, resolve } = configure();
//
//     const arg = of(1);
//     const todos = query({
//       args: arg,
//       fn: api.getTodos,
//       key: (args) => ['todos', args],
//       enabled: (args) => args === 2,
//     });
//
//     expect(todos()).toStrictEqual(future.idle());
//
//     todos.fetchQuery();
//     expect(todos()).toStrictEqual(future.idle());
//     expect(events).toStrictEqual([]);
//
//     arg.next(2);
//     todos.fetchQuery();
//     expect(events).toStrictEqual([{ type: 'fetch', params: 2 }]);
//     expect(todos()).toStrictEqual(future.pending());
//     resolve();
//   });
//
//   it('should work with initialData param', () => {
//     const { api } = configure();
//
//     const initialData = randomTodos();
//     const todos = query({
//       fn: api.getTodos,
//       key: () => ['todos'],
//       initialData,
//     });
//
//     expect(todos()).toStrictEqual(future.success(initialData));
//   });
//
//   it('should correctly handle start/stop', async () => {
//     const { api, events, resolve } = configure();
//
//     const arg = of(1);
//     const todos = query({
//       args: arg,
//       fn: api.getTodos,
//       key: (arg) => ['todos', arg],
//     });
//
//     todos.listen();
//     expect(events).toStrictEqual([{ type: 'fetch', params: 1 }]);
//
//     resolve();
//     await when(todos, future.isSuccess);
//     expect(last(events)).toStrictEqual({ type: 'resolve', result: todos() });
//
//     arg.next(2);
//     await nextTick();
//     expect(last(events)).toStrictEqual({ type: 'fetch', params: 2 });
//     resolve();
//     await when(todos, future.isSuccess);
//   });
//
//   it('should correctly handle abort same instance', async () => {
//     const { api, events, resolve } = configure();
//
//     const arg = of(1);
//     const todos = query({
//       args: arg,
//       fn: api.getTodos,
//       key: (arg) => ['todos', arg],
//     });
//
//     todos.listen();
//     expect(events).toStrictEqual([{ type: 'fetch', params: 1 }]);
//
//     arg.next(2);
//     await nextTick();
//     expect(last(events)).toStrictEqual({ type: 'abort' });
//     resolve();
//     await when(todos, future.isSuccess);
//   });
//
//   it('should correctly handle abort different instances & same key', async () => {
//     const run1 = configure();
//     const run2 = configure();
//
//     const arg = of(1);
//     const todos1 = query({
//       args: arg,
//       fn: run1.api.getTodos,
//       key: (arg) => ['todos', arg],
//     });
//     const todos2 = query({
//       args: arg,
//       fn: run2.api.getTodos,
//       key: (arg) => ['todos', arg],
//     });
//
//     todos1.listen();
//     todos2.listen();
//     expect(run1.events).toStrictEqual([{ type: 'fetch', params: 1 }]);
//     expect(run2.events).toStrictEqual([]);
//
//     arg.next(2);
//     await nextTick();
//     expect(last(run1.events)).toStrictEqual({ type: 'abort' });
//     expect(run2.events).toStrictEqual([]);
//
//     run1.resolve();
//     await when(todos1, future.isSuccess);
//     await when(todos2, future.isSuccess);
//     expect(todos1()).toStrictEqual(todos2());
//   });
//
//   it('should trigger dependsOn observables', async () => {
//     const { api } = configure();
//
//     const provider = query({
//       fn: api.getTodos,
//       key: (arg) => ['provider', arg],
//     });
//     const consumer = query({
//       args: provider,
//       fn: api.getTodos,
//       key: (arg) => ['consumer', arg],
//       dependsOn: provider,
//     });
//
//     const listen = jest.fn();
//     const dispose = jest.fn();
//     jest.spyOn(provider, 'listen').mockImplementation(() => {
//       listen();
//       return () => dispose();
//     });
//
//     const disposeConsumer = consumer.listen();
//     expect(listen).toHaveBeenCalled();
//
//     disposeConsumer();
//     expect(dispose).toHaveBeenCalled();
//   });
//
//   it('should trigger onRequest/Success/Error/Settled', async () => {
//     const { api, reject, resolve } = configure();
//
//     const onRequest = jest.fn();
//     const onSuccess = jest.fn();
//     const onError = jest.fn();
//     const onSettled = jest.fn();
//
//     const todos = query({
//       fn: api.getTodos,
//       key: (arg) => ['provider', arg],
//       onRequest,
//       onSuccess,
//       onError,
//       onSettled,
//     });
//
//     expect(onRequest).not.toHaveBeenCalled();
//     expect(onSuccess).not.toHaveBeenCalled();
//     expect(onError).not.toHaveBeenCalled();
//     expect(onSettled).not.toHaveBeenCalled();
//
//     todos.fetchQuery();
//     expect(onRequest).toHaveBeenCalledTimes(1);
//
//     resolve();
//     await when(todos, future.isSuccess);
//     expect(onSettled).toHaveBeenCalledTimes(1);
//     expect(onSuccess).toHaveBeenCalledTimes(1);
//
//     todos.fetchQuery();
//     expect(onRequest).toHaveBeenCalledTimes(2);
//
//     reject();
//     await when(todos, future.isFailure);
//     expect(onSettled).toHaveBeenCalledTimes(2);
//     expect(onError).toHaveBeenCalledTimes(1);
//   });
//
//   // it('should work with refetchInterval param', () => {
//   //
//   // });
//   //
//   // it('should work with retry param', () => {});
//   //
//   // it('should work with retryDelay param', () => {});
//   //
//   // it('should work with cacheTime param', () => {});
//   //
//   // it('should has isIdle/Success/Pending/Failure properties', () => {});
//   //
//   // it('should has setQuery working', () => {});
//   //
//   // it('should has cancelQuery working', () => {});
//   //
//   // it('should has fetchQuery working', () => {});
// });
