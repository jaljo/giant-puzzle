import { createReducer } from '../../Util'
import { find, propEq } from 'ramda'

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

export const INITIAL_STATE = {
  meh: false,
  gameOver: false,
  winGame: false,
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
export const NEXT_COORDINATES_OBTAINED = '@giant-puzzle/Board/NEXT_COORDINATES_OBTAINED'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const MEH = '@giant-puzzle/Board/MEH'
export const GAME_OVER = '@giant-puzzle/Board/GAME_OVER'
export const WIN_GAME = '@giant-puzzle/Board/WIN_GAME'
export const RETRY = '@giant-puzzle/Board/RETRY'

// arrowKeyPressed :: direction
export const arrowKeyPressed = direction => ({
  type: ARROW_KEY_PRESSED,
  direction,
})

// requestCharacterMove :: (String, String) -> Action
export const requestCharacterMove = (characterId, direction) => ({
  type: REQUEST_CHARACTER_MOVE,
  characterId,
  direction,
})

// nextCoordinatesObtained :: (String, String, Tile) -> Action
export const nextCoordinatesObtained = (characterId, direction, targetTile) => ({
  type: NEXT_COORDINATES_OBTAINED,
  characterId,
  direction,
  targetTile,
})

// moveCharacter :: (String, String -> Coordinates) -> Action
export const moveCharacter = (characterId, direction, coordinates) => ({
  type: MOVE_CHARACTER,
  characterId,
  direction,
  coordinates,
})

// meh :: String -> Action
export const meh = characterId => ({
  type: MEH,
  characterId,
})

// gameOver :: () -> Action
export const gameOver = () => ({ type: GAME_OVER })

// winGame :: () -> Action
export const winGame = () => ({ type: WIN_GAME })

// retry :: () -> Action
export const retry = () => ({ type: RETRY })

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
  }),

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
