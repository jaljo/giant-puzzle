import { fromEvent, zip } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, debounceTime, ignoreElements, tap, filter, withLatestFrom, mergeMap } from 'rxjs/operators'
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
  or,
  path,
  both,
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
  nextCoordinatesObtained,
  NEXT_COORDINATES_OBTAINED,
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

// tileToCoordinates :: Maybe Tile -> Maybe Coordinates
const tileToCoordinates = omit(['char', 'locked'])

// directionIs :: String -> [Any, Action] -> Boolean
const directionIs = key => ([ _, action ]) => action.direction === key

// isNotOutOfBounds :: Maybe Tile -> Boolean
const isNotOutOfBounds = tile => tile.x !== null && tile.y !== null

// isFreeOfAnyCharacter :: Tile -> Boolean
const isFreeOfAnyCharacter = o(isNil, prop('char'))

// isNotGuarded :: Tile -> Boolean
const isNotGuarded = pipe(
  path(['char', 'id']),
  complement(includes(__, [GUARDIAN_REGULAR.id, GUARDIAN_REVERSE.id])),
)

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

// requestMainCharacterMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
const requestMainCharacterMoveEpic = action$ =>
  action$.pipe(
    ofType(ARROW_KEY_PRESSED),
    // @TODO inject characters id rather than using them directly
    map(action => requestCharacterMove(MAIN_CHARACTER.id, action.direction)),
  )

const moveMainCharacterEpic = action$ =>
  action$.pipe(
    ofType(NEXT_COORDINATES_OBTAINED),
    filter(isMainCharacterMove),
    map(ifElse(
      o(allPass([isNotOutOfBounds, isNotLocked, isNotGuarded]), prop('targetTile')),
      action => moveCharacter(
        action.characterId,
        action.direction,
        tileToCoordinates(action.targetTile)
      ),
      o(meh, prop('characterId')),
    ))
  )

// obtainNextCoordinatesEpic :: Epic -> Observable Action MOVE_CHARACTER MEH
const obtainNextCoordinatesEpic = (action$, state$) =>
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
    map(([ tile, action ]) => nextCoordinatesObtained(
      action.characterId,
      action.direction,
      tile,
    )),
  )

// isMainCharacterMove :: Action -> Boolean
const isMainCharacterMove = action => action.characterId === MAIN_CHARACTER.id
const isRegularGuardianMove = action => action.characterId === GUARDIAN_REGULAR.id
const isReverseGuardianMove = action => action.characterId === GUARDIAN_REVERSE.id

// requestRegularGuardianMoveEpic
const requestRegularGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainCharacterMove),
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

const requestReverseGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainCharacterMove),
    map(pipe(
      prop('direction'),
      getOppositeDirection,
      // @TODO inject characters id rather than using them directly
      direction => requestCharacterMove(GUARDIAN_REVERSE.id, direction),
    )),
  )

// const willNotCollideWithTheOtherGuardian =
const moveGuardianEpic = action$ =>
  action$.pipe(
    ofType(NEXT_COORDINATES_OBTAINED),
    filter(complement(isMainCharacterMove)),
    map(ifElse(
      o(allPass([isNotOutOfBounds, isNotLocked, isNotGuarded]), prop('targetTile')),
      action => moveCharacter(
        action.characterId,
        action.direction,
        tileToCoordinates(action.targetTile)
      ),
      o(meh, prop('characterId')),
    )),
    // tap(console.warn),
    // ignoreElements(),
  )

const tileIsFree = allPass([isNotOutOfBounds, isNotLocked, isNotGuarded])

//
const haveNotTheSameDestination = (a, b) => or(
  a.targetTile.x !== b.targetTile.x,
  a.targetTile.y !== b.targetTile.y,
)

const test = action$ =>
  zip(
    action$.pipe(
      ofType(NEXT_COORDINATES_OBTAINED),
      filter(isRegularGuardianMove),
    ),
    action$.pipe(
      ofType(NEXT_COORDINATES_OBTAINED),
      filter(isReverseGuardianMove),
    ),
  ).pipe(
    tap(([ a, b ]) => console.warn(haveNotTheSameDestination(a,b))),
    filter(([ a, b ]) => haveNotTheSameDestination(a,b)),
    mergeMap(([ regularGuardianAction, reverseGuardianAction ]) => [
      // regualarGuardian
      ifElse(
        // both(
          o(tileIsFree, prop('targetTile')),
        //   () => haveNotTheSameDestination(regularGuardianAction, reverseGuardianAction),
        // ),
        action => moveCharacter(
          action.characterId,
          action.direction,
          tileToCoordinates(action.targetTile)
        ),
        o(meh, prop('characterId')),
      )(regularGuardianAction),
      // reverseGuardian
      ifElse(
        // both(
          o(tileIsFree, prop('targetTile')),
        //   () => haveNotTheSameDestination(regularGuardianAction, reverseGuardianAction),
        // ),
        action => moveCharacter(
          action.characterId,
          action.direction,
          tileToCoordinates(action.targetTile)
        ),
        o(meh, prop('characterId')),
      )(reverseGuardianAction),
    ]),
    // ignoreElements(),
  )

export default combineEpics(
  keyEventToMoveActionEpic,
  requestMainCharacterMoveEpic,
  obtainNextCoordinatesEpic,
  requestRegularGuardianMoveEpic,
  requestReverseGuardianMoveEpic,

  moveMainCharacterEpic,
  // moveGuardianEpic,

  test,
)
