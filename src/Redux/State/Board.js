import {
  createReducer,
  findTileWithCharacter,
  getOppositeDirection,
  coordsExistsInTileSet,
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

export const ARROW_KEY_PRESSED = '@giant-puzzle/Board/ARROW_KEY_PRESSED'
export const REQUEST_CHARACTER_MOVE = '@giant-puzzle/Board/REQUEST_CHARACTER_MOVE'
export const DESTINATION_TILE_FOUND = '@giant-puzzle/Board/DESTINATION_TILE_FOUND'
export const MOVE_CHARACTER = '@giant-puzzle/Board/MOVE_CHARACTER'
export const MEH = '@giant-puzzle/Board/MEH'
export const CLEAR = '@giant-puzzle/Board/CLEAR'

// arrowKeyPressed :: direction
export const arrowKeyPressed = direction => ({
  type: ARROW_KEY_PRESSED,
  direction,
})

// requestCharacterMove :: String -> String -> Action
const requestCharacterMove = characterId => direction => ({
  type: REQUEST_CHARACTER_MOVE,
  characterId,
  direction,
})

// requestMainCharMove :: String -> Action
export const requestMainCharMove = requestCharacterMove(MAIN_CHARACTER.id)

// requestRegularGuardMove :: String -> Action
export const requestRegularGuardMove = requestCharacterMove(GUARDIAN_REGULAR.id)

// requestReverseGuardMove :: String -> Action
export const requestReverseGuardMove = requestCharacterMove(GUARDIAN_REVERSE.id)

// destinationTileFound :: (String, String, Tile) -> Action
export const destinationTileFound = (characterId, direction, targetTile) => ({
  type: DESTINATION_TILE_FOUND,
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
export const meh = () => ({ type: MEH })

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

  [MOVE_CHARACTER]: (state, { characterId, coordinates }) => state.map(
    line => line.map(tile => ({
      ...tile,
      char: resolveCharacter(state, tile, coordinates, characterId),
    }))
  ),

  [CLEAR]: () => INITIAL_STATE,
})

// move character on the target slide, remove it from the initial slide
// dont do anything for tiles with other characters on
//
// resolveCharacter :: ([[Tile]], Tile, Coordinates, String) -> Maybe Character
export const resolveCharacter = (lines, tile, coordinates, characterId) =>
  (tile.x === coordinates.x && tile.y === coordinates.y)
    ? findTileWithCharacter(characterId)(lines).char
    : (tile.char && tile.char.id === characterId)
      ? null
      : tile.char
