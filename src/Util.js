import {
  defaultTo,
  filter,
  flatten,
  head,
  identity,
  isEmpty,
  map,
  pipe,
  prop,
  propOr,
  reject,
} from 'ramda'

// createReducer :: (State, Object) -> (State, Action) -> State
export const createReducer = (initialState, handlers) =>
  (state = initialState, action = {}) =>
    propOr(identity, prop('type', action), handlers)(state, action)

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

// findTileInLine :: Coordinates -> [Tile] -> [Tile]
const findTileInLine = coord => pipe(
  filter(tile => tile.x === coord.x && tile.y === coord.y),
  reject(isEmpty),
)

// findTileByCoordinates :: Coordinates -> [[Tile]] -> Tile
export const findTileByCoordinates = coord => pipe(
  map(findTileInLine(coord)),
  reject(isEmpty),
  flatten,
  head,
  defaultTo({ x: null, y: null, char: null, locked: true })
)

export const getWinTileA = findTileByCoordinates({ x: 1, y: 4 })
export const getWinTileB = findTileByCoordinates({ x: 3, y: 4 })

// getOppositeDirection :: String -> String
export const getOppositeDirection = direction => prop(direction, {
  up: 'down',
  down: 'up',
  right: 'left',
  left: 'right',
})
