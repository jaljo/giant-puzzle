import * as Module from './index'

describe('Redux :: Module', () => {
  it('contains the Board state', () => {
    const state = Module.default()

    expect(state.Board).toBeDefined()
    expect(state.Game).toBeDefined()
  })

  it('contains the Game state', () => {
    const state = Module.default()

    expect(state.Game).toBeDefined()
  })
})
