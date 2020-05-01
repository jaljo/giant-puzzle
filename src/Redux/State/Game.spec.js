import {
  default as reducer,
  INITIAL_STATE,
  gameOver,
  winGame,
} from './Game'

describe('Redux :: State :: Game', () => {
  it('reduces gameOver action', () => {
    expect(
      reducer(INITIAL_STATE, gameOver())
    ).toEqual({
      ...INITIAL_STATE,
      gameOver: true,
    })
  })

  it('reduces winGame action', () => {
    expect(
      reducer(INITIAL_STATE, winGame())
    ).toEqual({
      ...INITIAL_STATE,
      winGame: true,
    })
  })
})
