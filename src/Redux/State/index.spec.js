import * as Module from './index'

describe('Redux :: Module', () => {
  it('contains the Board state', () => {
    const state = Module.default();

    expect(state.Board).toBeDefined();
  });
})
