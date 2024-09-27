import { fromEvent } from './lib.ts';

describe('fromEvent', () => {
  it('should create from spot input', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();

    const source = fromEvent(
      { addEventListener, removeEventListener },
      'event-name',
    );

    const dispose1 = source.listen();
    expect(addEventListener).toHaveBeenCalledTimes(1);
    dispose1();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('should create from lazy spot input', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();

    const source = fromEvent(
      () => ({ addEventListener, removeEventListener }),
      'event-name',
    );

    const dispose1 = source.listen();
    expect(addEventListener).toHaveBeenCalledTimes(1);
    dispose1();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('should create from delayed input', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();

    const source = fromEvent('event-name');

    const dispose1 = source.listen({ addEventListener, removeEventListener });
    expect(addEventListener).toHaveBeenCalledTimes(1);
    dispose1();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});
