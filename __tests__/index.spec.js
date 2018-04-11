import handleError from '../middleware/index';

describe('koa-advanced-handle-error', () => {
  it('function exists', () => {
    expect(handleError).toBeInstanceOf(Function);
  });
});
