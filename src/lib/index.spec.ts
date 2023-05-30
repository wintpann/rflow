import { Test } from './index.ts';

describe('should test', () => {
  it('should create instance', () => {
    const test = new Test();
    expect(test).toBeInstanceOf(Test);
  });
});
