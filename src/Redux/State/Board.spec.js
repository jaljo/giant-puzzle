import {
  default as reducer,
  INITIAL_STATE,
} from './Board'

describe('Redux :: State :: Board', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE)
    expect(INITIAL_STATE).toMatchSnapshot()
  })
})
