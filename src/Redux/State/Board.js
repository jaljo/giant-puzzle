import {
  createReducer,
  findTileWithCharacter,
  findTileByCoordinates,
} from '../../Util'
import {
  find,
  propEq,
} from 'ramda'

export const MAIN_CHARACTER = {
  id: 'main-character',
  image: 'https://image.flaticon.com/icons/svg/2754/2754522.svg',
}

export const GUARDIAN_REGULAR = {
  id: 'guardian-regular',
  image: 'https://image.flaticon.com/icons/svg/562/562802.svg',
}

export const GUARDIAN_REVERSE = {
  id: 'guardian-reverse',
  image: 'https://image.flaticon.com/icons/svg/2699/2699064.svg',
}

const CHARACTER_MAP = [
  MAIN_CHARACTER,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
]

const findCharacter = id => find(propEq('id', id), CHARACTER_MAP)

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
        char: GUARDIAN_REVERSE,
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
          char: GUARDIAN_REGULAR,
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
export const REQUEST_CHARACTER_MOVE = '@giant-puzzle/Board/REQUEST_CHARACTER_MOVE'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const MEH = '@giant-puzzle/Board/MEH'

// arrowKeyPressed :: direction
export const arrowKeyPressed = direction => ({
  type: ARROW_KEY_PRESSED,
  direction,
})

export const requestCharacterMove = (characterId, direction) => ({
  type: REQUEST_CHARACTER_MOVE,
  characterId,
  direction,
})

export const moveCharacter = characterId => coordinates => ({
  type: MOVE_CHARACTER,
  characterId,
  coordinates,
})

// meh :: () -> Action
export const meh = () => ({ type: MEH })

export default createReducer(INITIAL_STATE, {
  [ARROW_KEY_PRESSED]: state => ({
    ...state,
    meh: false,
  }),

  [MOVE_CHARACTER]: (state, { characterId, coordinates }) => ({
    ...state,
    lines: state.lines.map(
      line => line.map(tile => ({
        ...tile,
        char: resolveCharacter(tile, coordinates, characterId),
      }))
    ),
  }),

  [MEH]: state => ({
    ...state,
    meh: true,
  })
})

// move character on the target slide, remove it from the initial slide
// dont do anything for tiles with other characters on
//
// resolveCharacter :: (Tile, Coordinates, String) -> Maybe Character
export const resolveCharacter = (tile, coordinates, characterId) =>
  (tile.x === coordinates.x && tile.y === coordinates.y)
    ? findCharacter(characterId)
    : (tile.char && tile.char.id === characterId)
      ? null
      : tile.char
