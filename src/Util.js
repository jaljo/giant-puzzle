import {
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

// findTileByCoordinates :: Coordinates -> [[Tile]] -> Maybe Tile
export const findTileByCoordinates = coord => pipe(
  map(findTileInLine(coord)),
  reject(isEmpty),
  flatten,
  head,
)
