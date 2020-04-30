import {
  __,
  evolve,
  complement,
  defaultTo,
  filter,
  find,
  flatten,
  head,
  identity,
  includes,
  isEmpty,
  map,
  pipe,
  prop,
  propOr,
  reject,
  replace,
  toLower,
  dec,
  inc,
} from 'ramda'

// console.warn(isGuardCharacter('fuck'))
// createReducer :: (State, Object) -> (State, Action) -> State
export const createReducer = (initialState, handlers) =>
  (state = initialState, action = {}) =>
    propOr(identity, prop('type', action), handlers)(state, action)

// hasCoordinates :: (Number, Number) -> Object -> Boolean
export const hasCoordinates = (x, y) => obj => obj.x === x && obj.y === y

// findCharacterInLine :: String -> [Tile] -> [Tile]
const findCharacterInLine = characterId => pipe(
  filter(tile => tile.char !== null && tile.char.id === characterId),
  reject(isEmpty),
)

// findTileWithCharacter :: String -> [[Tile]] -> Tile
export const findTileWithCharacter = characterId => pipe(
  map(findCharacterInLine(characterId)),
  reject(isEmpty),
  flatten,
  head,
)

// findTileInRow :: (Number, Number) -> [Tile] -> [Tile]
const findTileInRow = (x, y) => pipe(
  filter(hasCoordinates(x, y)),
  reject(isEmpty),
)

// findTileByCoordinates :: (Number, Number) -> [[Tile]] -> Tile
export const findTileByCoordinates = (x, y) => pipe(
  map(findTileInRow(x, y)),
  reject(isEmpty),
  flatten,
  head,
  defaultTo({ x: null, y: null, char: null, locked: true })
)

// getWinTileA :: [[Tile]] -> Tile
export const getWinTileA = findTileByCoordinates(1, 4)

// geWinTileB :: [[Tile]] -> Tile
export const getWinTileB = findTileByCoordinates(3, 4)

// getOppositeDirection :: String -> String
export const getOppositeDirection = direction => prop(direction, {
  up: 'down',
  down: 'up',
  right: 'left',
  left: 'right',
})

// isGoal :: (Number, Number) -> Boolean
export const isGoal = (x , y) => y === 4 && (x === 1 || x === 3)

// coordsExistsInTileSet :: [Tile] -> (Number, Number) -> Boolean
export const coordsExistsInTileSet = set => (x, y) => pipe(
  filter(hasCoordinates(x, y)),
  complement(isEmpty),
)(set)

// getCharByCoordinates :: [Tile] -> (Number, Number) -> Maybe Character
export const getCharByCoordinates = set => (x, y) => pipe(
  find(hasCoordinates(x, y)),
  propOr(null, 'char'),
)(set)

/**
 * KeyboardEvents utilities
 */

// isArrowKeyPressed :: KeyboardEvent -> Boolean
export const isArrowKeyPressed = pipe(
  prop('key'),
  includes(__, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']),
)

// keyboardEventToDirection :: KeyboardEvent -> String
export const keyboardEventToDirection = pipe(
  prop('key'),
  toLower,
  replace('arrow', ''),
)

/**
 * Tile utilities
 */

// toLeft :: Tile -> [Number, Number]
export const toLeft = tile => [ tile.x-1, tile.y ]

// toRight :: Tile -> [Number, Number]
export const toRight = tile => [ tile.x+1, tile. y ]

// toUp :: Tile -> [Number, Number]
export const toUp = tile => [ tile.x, tile.y+1 ]

// toDown :: Tile -> [Number, Number]
export const toDown = tile => [ tile.x, tile.y-1 ]
