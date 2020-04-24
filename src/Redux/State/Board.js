import { createReducer } from '../../Util'

export const MAIN_CHARACTER = {
  id: 'main-character',
  name: 'fuck'
}

const INITIAL_STATE = [
  // l3
  [
      {
          x: 0,
          y: 2,
          char: null,
      }, {
          x: 1,
          y: 2 ,
          char: null,
      }, {
          x: 2,
          y: 2,
          char: null,
      }
  ],
  // l2
  [
      {
          x: 0,
          y: 1,
          char: MAIN_CHARACTER,
      }, {
          x: 1,
          y: 1,
          char: null,
      }, {
          x: 2,
          y: 1,
          char: null,
      }
  ],
  // l1
  [
      {
          x: 0,
          y: 0,
          char: null,
      }, {
          x: 1,
          y: 0,
          char: null,
      }, {
          x: 2,
          y: 0,
          char: null,
      }
  ],
]

export const UP = '@giant-puzzle/Board/UP'
export const DOWN = '@giant-puzzle/Board/DOWN'
export const LEFT = '@giant-puzzle/Board/LEFT'
export const RIGHT = '@giant-puzzle/Board/RIGHT'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const MEH = '@giant-puzzle/Board/MEH'

export const up = () => ({ type: UP })
export const down = () => ({ type: DOWN })
export const left = () => ({ type: LEFT })
export const right = () => ({ type: RIGHT })
export const moveCharacter = charcaterId => coordinates => ({
  type: MOVE_CHARACTER,
  charcaterId,
  coordinates,
})
export const meh = () => ({ type: MEH })

export default createReducer(INITIAL_STATE, {

})
