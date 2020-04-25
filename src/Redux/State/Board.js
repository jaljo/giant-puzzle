import {
  createReducer,
  findTileWithCharacter,
  findTileByCoordinates,
} from '../../Util'

export const MAIN_CHARACTER = {
  id: 'main-character',
  name: 'fuck'
}

const INITIAL_STATE = {
  meh: false,
  lines: [
    // l6
    [
      {
        x: 0,
        y: 5,
        char: null,
        locked: false,
      }, {
        x: 1,
        y: 5 ,
        char: null,
        locked: false,
      }, {
        x: 2,
        y: 5,
        char: null,
        locked: true,
      }, {
        x: 3,
        y: 5 ,
        char: null,
        locked: false,
      }, {
        x: 4,
        y: 5,
        char: null,
        locked: false,
      }
    ],
    // l5
    [
      {
        x: 0,
        y: 4,
        char: null,
        locked: false,
      }, {
        x: 1,
        y: 4 ,
        char: null,
        locked: false,
      }, {
        x: 2,
        y: 4,
        char: null,
        locked: false,
      }, {
        x: 3,
        y: 4 ,
        char: null,
        locked: false,
      }, {
        x: 4,
        y: 4,
        char: null,
        locked: false,
      }
    ],
    // l4
    [
      {
        x: 0,
        y: 3,
        char: null,
        locked: false,
      }, {
        x: 1,
        y: 3 ,
        char: null,
        locked: false,
      }, {
        x: 2,
        y: 3,
        char: null,
        locked: false,
      }, {
        x: 3,
        y: 3 ,
        char: null,
        locked: false,
      }, {
        x: 4,
        y: 3,
        char: null,
        locked: false,
      }
    ],
    // l3
    [
        {
          x: 0,
          y: 2,
          char: null,
          locked: true,
        }, {
          x: 1,
          y: 2 ,
          char: null,
          locked: false,
        }, {
          x: 2,
          y: 2,
          char: MAIN_CHARACTER,
          locked: false,
        }, {
          x: 3,
          y: 2 ,
          char: null,
          locked: false,
        }, {
          x: 4,
          y: 2,
          char: null,
          locked: true,
        }
    ],
    // l2
    [
        {
          x: 0,
          y: 1,
          char: null,
          locked: true,
        }, {
          x: 1,
          y: 1,
          char: null,
          locked: false,
        }, {
          x: 2,
          y: 1,
          char: null,
          locked: false,
        }, {
          x: 3,
          y: 1 ,
          char: null,
          locked: false,
        }, {
          x: 4,
          y: 1,
          char: null,
          locked: true,
        }
    ],
    // l1
    [
        {
          x: 0,
          y: 0,
          char: null,
          locked: true,
        }, {
          x: 1,
          y: 0,
          char: null,
          locked: true,
        }, {
          x: 2,
          y: 0,
          char: null,
          locked: false,
        }, {
          x: 3,
          y: 0,
          char: null,
          locked: true,
        }, {
          x: 4,
          y: 0,
          char: null,
          locked: true,
        }
    ],
  ]
}

export const ARROW_KEY_PRESSED = '@giant-puzzle/Board/ARROW_KEY_PRESSED'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const MEH = '@giant-puzzle/Board/MEH'

// arrowKeyPressed :: direction
export const arrowKeyPressed = direction => ({
  type: ARROW_KEY_PRESSED,
  direction,
})

// moveCharacter :: String -> Coordinates -> Action
export const moveCharacter = charcaterId => coordinates => ({
  type: MOVE_CHARACTER,
  charcaterId,
  coordinates,
})

// meh :: () -> Action
export const meh = () => ({ type: MEH })

export default createReducer(INITIAL_STATE, {
  [ARROW_KEY_PRESSED]: state => ({
    ...state,
    meh: false,
  }),

  [MOVE_CHARACTER]: (state, { charcaterId, coordinates }) => ({
    ...state,
    lines: state.lines.map(
      line => line.map(tile => tile.x === coordinates.x && tile.y === coordinates.y
        ? {
          ...tile,
          char: MAIN_CHARACTER,
        }
        : {
          ...tile,
          char: null,
        }
      )
    ),
  }),

  [MEH]: state => ({
    ...state,
    meh: true,
  })
})
