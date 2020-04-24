import { fromEvent } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, debounceTime, ignoreElements, tap, filter, withLatestFrom } from 'rxjs/operators'
import { findTileByCoordinates, findTileWithCharacter } from './../Util'
import {
  __,
  allPass,
  complement,
  cond,
  dec,
  evolve,
  ifElse,
  inc,
  includes,
  isNil,
  o,
  omit,
  pipe,
  prop,
  replace,
  toLower,
} from 'ramda'
import {
  ARROW_KEY_PRESSED,
  MAIN_CHARACTER,
  MOVE_CHARACTER,
  REQUEST_CHARACTER_MOVE,
  arrowKeyPressed,
  meh,
  moveCharacter,
  requestCharacterMove,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
} from './../Redux/State/Board'

// isArrowKeyPressed :: [String] -> KeyboardEvent -> Boolean
const isArrowKeyPressed = keyMap => pipe(
  prop('key'),
  includes(__, keyMap),
)

// keyEventToMoveActionEpic :: Epic -> Observable Action ARROW_KEY_PRESSED
const keyEventToMoveActionEpic = (action$, state$, { keyMap }) =>
  fromEvent(window, 'keyup').pipe(
    filter(isArrowKeyPressed(keyMap)),
    map(pipe(
      prop('key'),
      toLower,
      replace('arrow', ''),
      arrowKeyPressed,
    )),
  )

// toLeft :: Tile -> Coordinates
const toLeft = evolve({ x: dec })
const toRight = evolve({ x: inc })
const toUp = evolve({ y: inc })
const toDown = evolve({ y: dec })

// tileToCoordinates :: Tile -> Coordinates
const tileToCoordinates = omit(['char', 'locked'])

// directionIs :: String -> [Any, Action] -> Boolean
const directionIs = key => ([ _, action ]) => action.direction === key

// isNotOutOfBounds :: Maybe Tile -> Boolean
const isNotOutOfBounds = complement(isNil)

// isFreeOfAnyCharacter :: Tile -> Boolean
const isFreeOfAnyCharacter = o(isNil, prop('char'))

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

// moveMainCharacterEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
const moveMainCharacterEpic = action$ =>
  action$.pipe(
    ofType(ARROW_KEY_PRESSED),
    // @TODO inject characters id rather than using them directly
    map(action => requestCharacterMove(MAIN_CHARACTER.id, action.direction)),
  )

// moveCharacterEpic :: Epic -> Observable Action MOVE_CHARACTER MEH
const moveCharacterEpic = (action$, state$) =>
  action$.pipe(
    ofType(REQUEST_CHARACTER_MOVE),
    withLatestFrom(state$),
    // find the tile where the main character is
    // Observable [Action, State] -> Observable Tile
    map(([ action, state ]) => findTileWithCharacter(action.characterId)(state.Board.lines)),
    withLatestFrom(action$),
    // compute target coordinates
    // Observable [Tile, Action] -> Observable Coordinates
    map(pipe(
      cond([
        [directionIs('up'), ([ tile ]) => toUp(tile)],
        [directionIs('down'), ([ tile ]) => toDown(tile)],
        [directionIs('left'), ([ tile ]) => toLeft(tile)],
        [directionIs('right'), ([ tile ]) => toRight(tile)],
      ]),
      tileToCoordinates,
    )),
    withLatestFrom(state$),
    // find the tile matching the target coordinates (if any)
    // Observable [Coordinates, State] -> Observable [Maybe Tile]
    map(([ coordinates, state ]) => findTileByCoordinates(coordinates)(state.Board.lines)),
    withLatestFrom(action$),
    map(([ tile, action ]) => ifElse(
      allPass([isNotOutOfBounds, isFreeOfAnyCharacter, isNotLocked]),
      o(moveCharacter(action.characterId, action.direction), tileToCoordinates),
      meh,
    )(tile)),
  )

// mainCharacterHasMoved :: Action -> Boolean
const mainCharacterHasMoved = action => action.characterId === MAIN_CHARACTER.id

// moveRegularGuardianEpic
const moveRegularGuardianEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(mainCharacterHasMoved),
    // @TODO inject characters id rather than using them directly
    map(action => requestCharacterMove(GUARDIAN_REGULAR.id, action.direction)),
  )

// getOppositeDirection :: String -> String
const getOppositeDirection = direction => prop(direction, {
  up: 'down',
  down: 'up',
  right: 'left',
  left: 'right',
})

const moveReverseGuardianEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(mainCharacterHasMoved),
    map(pipe(
      prop('direction'),
      getOppositeDirection,
      // @TODO inject characters id rather than using them directly
      direction => requestCharacterMove(GUARDIAN_REVERSE.id, direction),
    )),
  )

export default combineEpics(
  keyEventToMoveActionEpic,
  moveMainCharacterEpic,
  moveCharacterEpic,
  moveRegularGuardianEpic,
  moveReverseGuardianEpic,
)
