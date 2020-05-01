import {
  coordsExistsInTileSet,
  createReducer,
  getOppositeDirection,
  moveCharToTile,
} from './../../Util'
import {
  getCharInitialPos,
  isRegularCharacter,
  MAIN_CHARACTER,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
} from './Characters'
import {
  map,
  reverse,
  pipe,
} from 'ramda'

const BOARD_ROWS = [0, 1, 2, 3, 4, 5]
const BOARD_COLS = [0, 1, 2, 3, 4]
const LOCKED_TILES = [
  { x: 2, y: 5 },
  { x: 0, y: 2 },
  { x: 4, y: 2 },
  { x: 0, y: 1 },
  { x: 4, y: 1 },
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 3, y: 0 },
  { x: 4, y: 0 },
]

// isLocked :: (Number, Number) -> Boolean
const isLocked = coordsExistsInTileSet(LOCKED_TILES)

// createTile :: (Number, Number) -> Tile
const createTile = (x, y ) => ({
  x,
  y,
  char: getCharInitialPos(x, y),
  locked: isLocked(x, y),
})

// buildBoardInitialState :: [Number] -> [Number] -> [[Tile]]
const buildBoardInitialState = columns => pipe(
  map(rowId => map(
    colId => createTile(colId, rowId),
    columns
  )),
  reverse,
)

// @see Board.spec.js.snap for a concrete representation of the state
export const INITIAL_STATE = buildBoardInitialState(BOARD_COLS)(BOARD_ROWS)

// action types
export const ARROW_KEY_PRESSED = '@giant-puzzle/Board/ARROW_KEY_PRESSED'
export const REQUEST_CHARACTER_MOVE = '@giant-puzzle/Board/REQUEST_CHARACTER_MOVE'
export const DESTINATION_TILE_FOUND = '@giant-puzzle/Board/DESTINATION_TILE_FOUND'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const CLEAR = '@giant-puzzle/Board/CLEAR'

// arrowKeyPressed :: String -> Action
export const arrowKeyPressed = direction => ({
  type: ARROW_KEY_PRESSED,
  direction,
})

// requestCharacterMove :: String -> String -> Action
const requestCharacterMove = id => direction => ({
  type: REQUEST_CHARACTER_MOVE,
  id,
  direction,
})

// requestMainCharMove :: String -> Action
export const requestMainCharMove = requestCharacterMove(MAIN_CHARACTER.id)

// requestRegularGuardMove :: String -> Action
export const requestRegularGuardMove = requestCharacterMove(GUARDIAN_REGULAR.id)

// requestReverseGuardMove :: String -> Action
export const requestReverseGuardMove = requestCharacterMove(GUARDIAN_REVERSE.id)

// destinationTileFound :: (String, String, Tile) -> Action
export const destinationTileFound = (id, direction, tile) => ({
  type: DESTINATION_TILE_FOUND,
  id,
  direction,
  tile,
})

// moveCharacter :: Action.DESTINATION_TILE_FOUND -> Action
export const moveCharacter = ({ id, direction, tile }) => ({
  type: MOVE_CHARACTER,
  id,
  direction,
  x: tile.x,
  y: tile.y,
})

// retry :: () -> Action
export const clear = () => ({ type: CLEAR })

export default createReducer(INITIAL_STATE, {
  [ARROW_KEY_PRESSED]: (state, { direction }) => state.map(
    line => line.map(tile => ({
      ...tile,
      char: tile.char === null
        ? null
        : {
          ...tile.char,
          direction: isRegularCharacter(tile.char.id)
            ? direction
            : getOppositeDirection(direction)
          ,
        }
      ,
    }))
  ),

  [MOVE_CHARACTER]: (state, { id, x, y }) => state.map(
    line => line.map(tile => ({
      ...tile,
      char: moveCharToTile(state, id, x, y)(tile),
    }))
  ),

  [CLEAR]: () => INITIAL_STATE,
})
