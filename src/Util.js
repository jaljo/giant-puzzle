import {
  __,
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
  pathEq,
  pipe,
  prop,
  propOr,
  reject,
  replace,
  toLower,
} from 'ramda'

/**
 * Redux utilities
 */

// createReducer :: (State, Object) -> (State, Action) -> State
export const createReducer = (initialState, handlers) =>
  (state = initialState, action = {}) =>
    propOr(identity, prop('type', action), handlers)(state, action)

/**
 * Coordinates utilities
 */

// isGoal :: (Number, Number) -> Boolean
export const isGoal = (x , y) => y === 4 && (x === 1 || x === 3)

// hasCoordinates :: (Number, Number) -> Object -> Boolean
export const hasCoordinates = (x, y) => obj => obj.x === x && obj.y === y

// hasDistinctCoordinates :: (Object, Object) -> Boolean
export const hasDistinctCoordinates = (a, b) => (a.x !== b.x) || (a.y !== b.y)

const transformMap = {
  'up':    (x, y) => [ x, y+1 ],
  'left':  (x, y) => [ x-1, y ],
  'down':  (x, y) => [ x, y-1 ],
  'right': (x, y) => [ x+1, y ],
}

// getNextDirection :: (Number, Number, String) -> (Number, Number)
export const getNextDirection = (x, y, direction) => pipe(
  prop(direction),
  transformer => transformer(x, y),
)(transformMap)

// getOppositeDirection :: String -> String
export const getOppositeDirection = direction => prop(direction, {
  up: 'down',
  down: 'up',
  right: 'left',
  left: 'right',
})

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

// findCharacterInRow :: String -> [Tile] -> [Tile]
const findCharacterInRow = id => pipe(
  filter(pathEq(['char', 'id'], id)),
  reject(isEmpty),
)

// findTileWithCharacter :: String -> [[Tile]] -> Tile
export const findTileWithCharacter = id => pipe(
  map(findCharacterInRow(id)),
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
