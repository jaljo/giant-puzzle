import { createReducer } from './../../Util'

// initial state
export const INITIAL_STATE = {
  gameOver: false,
  winGame: false,
}

// action types
export const GAME_OVER = '@giant-puzzle/Game/GAME_OVER'
export const WIN_GAME = '@giant-puzzle/Game/WIN_GAME'
export const RETRY = '@giant-puzzle/Game/RETRY'

// gameOver :: () -> Action
export const gameOver = () => ({ type: GAME_OVER })

// winGame :: () -> Action
export const winGame = () => ({ type: WIN_GAME })

// retry :: () -> Action
export const retry = () => ({ type: RETRY })

// Game :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [GAME_OVER]: state => ({
    ...state,
    gameOver: true,
  }),

  [WIN_GAME]: state => ({
    ...state,
    winGame: true,
  }),

  [RETRY]: () => INITIAL_STATE,
})
