import { fromEvent } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, ignoreElements, tap, filter, withLatestFrom } from 'rxjs/operators'
import { findTileByCoordinates, findTileWithCharacter } from './../Util'
import {
  __,
  cond,
  dec,
  dissoc,
  evolve,
  inc,
  includes,
  pipe,
  prop,
  o,
  complement,
  isNil,
  ifElse,
  allPass,
} from 'ramda'
import {
  arrowKeyPressed,
  MAIN_CHARACTER,
  meh,
  moveCharacter,
  ARROW_KEY_PRESSED,
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
    map(o(arrowKeyPressed, prop('key'))),
  )

// toLeft :: Tile -> Coordinates
const toLeft = evolve({ x: dec })
const toRight = evolve({ x: inc })
const toUp = evolve({ y: inc })
const toDown = evolve({ y: dec })

// tileToCoordinates :: Tile -> Coordinates
const tileToCoordinates = dissoc('char')

// directionIs :: String -> [Any, Action] -> Boolean
const directionIs = key => ([ _, action ]) => action.direction === key

// isNotOutOfBounds :: Maybe Tile -> Boolean
const isNotOutOfBounds = complement(isNil)

// isFreeOfAnyCharacter :: Tile -> Boolean
const isFreeOfAnyCharacter = o(isNil, prop('char'))

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

// moveMainCharacterEpic :: Epic -> Observable Action MOVE_CHARACTER MEH
// @TODO inject characters id rather than using them directly
const moveMainCharacterEpic = (action$, state$) =>
  action$.pipe(
    ofType(ARROW_KEY_PRESSED),
    withLatestFrom(state$),
    // find the tile where the main character is
    // Observable [Action, State] -> Observable Tile
    map(([ _, state ]) => findTileWithCharacter(MAIN_CHARACTER.id)(state.Board.lines)),
    withLatestFrom(action$),
    // compute target coordinates
    // Observable [Tile, Action] -> Observable Coordinates
    map(pipe(
      cond([
        [directionIs('ArrowUp'), ([ tile ]) => toUp(tile)],
        [directionIs('ArrowDown'), ([ tile ]) => toDown(tile)],
        [directionIs('ArrowLeft'), ([ tile ]) => toLeft(tile)],
        [directionIs('ArrowRight'), ([ tile ]) => toRight(tile)],
      ]),
      tileToCoordinates,
    )),
    withLatestFrom(state$),
    // find the tile matching the target coordinates (if any)
    // Observable [Coordinates, State] -> Observable [Maybe Tile]
    map(([ coordinates, state ]) => findTileByCoordinates(coordinates)(state.Board.lines)),
    map(ifElse(
      allPass([isNotOutOfBounds, isFreeOfAnyCharacter, isNotLocked]),
      o(moveCharacter(MAIN_CHARACTER.id), tileToCoordinates),
      meh,
    )),
  )

export default combineEpics(
  keyEventToMoveActionEpic,
  moveMainCharacterEpic,
)
