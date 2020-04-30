import {
  includes,
  __,
} from 'ramda'
import {
  getCharByCoordinates,
} from './../../Util'

// MAIN_CHARACTER :: Character
export const MAIN_CHARACTER = {
  id: 'main-character',
  asset: 'chick',
  direction: 'up',
}

// GUARDIAN_REGULAR :: Character
export const GUARDIAN_REGULAR = {
  id: 'guardian-regular',
  asset: 'fox',
  direction: 'up',
}

// GUARDIAN_REVERSE :: Character
export const GUARDIAN_REVERSE = {
  id: 'guardian-reverse',
  asset: 'fox',
  direction: 'down',
}

// CHARS_INITIAL_POS :: [Tile]
export const CHARS_INITIAL_POS = [
  {
    x: 1,
    y: 5 ,
    char: GUARDIAN_REVERSE,
  },
  {
    x: 2,
    y: 2,
    char: MAIN_CHARACTER,
  },
  {
    x: 2,
    y: 0,
    char: GUARDIAN_REGULAR,
  },
]

// getCharInitialPos :: (Number, Number) -> Maybe Character
export const getCharInitialPos = getCharByCoordinates(CHARS_INITIAL_POS)

// isRegularCharacter :: String -> Boolean
export const isRegularCharacter = includes(__, [MAIN_CHARACTER.id, GUARDIAN_REGULAR.id])

// isGuardCharacter :: String -> Boolean
export const isGuardCharacter = includes(__, [GUARDIAN_REGULAR.id, GUARDIAN_REVERSE.id])

// mainCharMove :: Object -> Boolean
export const mainCharMove = obj => obj.characterId === MAIN_CHARACTER.id

// mainCharMove :: Object -> Boolean
export const regularGuardMove = obj => obj.characterId === GUARDIAN_REGULAR.id

// reverseGuardMove :: Object -> Boolean
export const reverseGuardMove = obj => obj.characterId === GUARDIAN_REVERSE.id
