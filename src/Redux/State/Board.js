import { createReducer } from '../../Util'

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
          char: null,
      }, {
          x: 1,
          y: 1,
          char: {
              name: 'fuck'
          }
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

export const up = () => ({ type: UP })
export const down = () => ({ type: DOWN })
export const left = () => ({ type: LEFT })
export const right = () => ({ type: RIGHT })

export default createReducer(INITIAL_STATE, {

})
