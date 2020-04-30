import { fromEvent, zip } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, filter, withLatestFrom, mergeMap, switchMap } from 'rxjs/operators'
import {
  findTileByCoordinates,
  findTileWithCharacter,
  getOppositeDirection,
  getWinTileA,
  getWinTileB,
  isArrowKeyPressed,
  keyboardEventToDirection,
  toDown,
  toLeft,
  toRight,
  toUp,
  hasDistinctCoordinates,
  isNotOutOfBounds,
  isNotLocked,
} from './../Util'
import {
  allPass,
  complement,
  cond,
  filter as rfilter,
  ifElse,
  isEmpty,
  isNil,
  map as rmap,
  o,
  pipe,
  prop,
  propOr,
} from 'ramda'
import {
  ARROW_KEY_PRESSED,
  MOVE_CHARACTER,
  DESTINATION_TILE_FOUND,
  REQUEST_CHARACTER_MOVE,
  arrowKeyPressed,
  clear,
  meh,
  moveCharacter,
  destinationTileFound,
  requestMainCharMove,
  requestRegularGuardMove,
  requestReverseGuardMove,
} from './../Redux/State/Board'
import {
  MAIN_CHARACTER,
  isMainChar,
  isReverseGuard,
  isRegularGuard,
  isGuardian,
} from './../Redux/State/Characters'
import {
  gameOver,
  winGame,
  RETRY,
} from './../Redux/State/Game'

// directionIs :: String -> [Any, Action] -> Boolean
const directionIs = direction => ([ _, action ]) => action.direction === direction

// isNotGuarded :: Tile -> Boolean
const isNotGuarded = pipe(
  propOr({}, 'char'),
  complement(isGuardian),
)

// everyTileIsGuarded :: [Tile] -> Boolean
export const everyTileIsGuarded = pipe(
  rfilter(isNotGuarded),
  isEmpty,
)

// tileIsFree :: Tile :: Boolean
const tileIsFree = allPass([isNotOutOfBounds, isNotLocked, isNotGuarded])

// moveCharacterOrMeh :: Action.DESTINATION_TILE_FOUND -> Action.MOVE_CHARACTER Action.MEH
const moveCharacterOrMeh = ifElse(
  o(tileIsFree, prop('tile')),
  a => moveCharacter(a.id, a.direction, a.tile.x, a.tile.y),
  meh,
)

// keyEventtileonEpic :: Epic -> Observable Action ARROW_KEY_PRESSED
const keyEventToMoveActionEpic = (_, state$) =>
  fromEvent(window, 'keyup').pipe(
    filter(isArrowKeyPressed),
    withLatestFrom(state$),
    filter(([ _, state ]) => !state.Game.gameOver && !state.Game.winGame),
    map(([ event ]) => event),
    map(o(arrowKeyPressed, keyboardEventToDirection)),
  )

// obtainNextCoordinatesEpic :: Epic -> Observable Action DESTINATION_TILE_FOUND
export const obtainNextCoordinatesEpic = (action$, state$) =>
  action$.pipe(
    ofType(REQUEST_CHARACTER_MOVE),
    withLatestFrom(state$),
    // find the tile where the character is
    // Observable [Action, State] -> Observable Tile
    map(([ action, state ]) => findTileWithCharacter(action.id)(state.Board)),
// *** ADAPTER
// map(tile => [tile.x, tile.y]),
// *** ADAPTER
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
    )),
    withLatestFrom(state$),
    // find the tile matching the target coordinates (if any)
    // Observable [Coordinates, State] -> Observable Tile
    map(([ [ x, y ], state ]) => findTileByCoordinates(x, y)(state.Board)),
    withLatestFrom(action$),
    map(([ tile, action ]) => destinationTileFound(
      action.id,
      action.direction,
      tile,
    )),
  )

// requestMainCharacterMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
export const requestMainCharacterMoveEpic = action$ =>
  action$.pipe(
    ofType(ARROW_KEY_PRESSED),
    map(o(requestMainCharMove, prop('direction'))),
  )

// moveMainCharacterEpic :: Epic -> Observable Action MOVE_CHARACTER MEH
export const moveMainCharacterEpic = action$ =>
  action$.pipe(
    ofType(DESTINATION_TILE_FOUND),
    filter(isMainChar),
    map(moveCharacterOrMeh),
  )

// requestRegularGuardianMoveEpic :: Epic -> REQUEST_CHARACTER_MOVE
export const requestRegularGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainChar),
    map(o(requestRegularGuardMove, prop('direction'))),
  )

// requestReverseGuardianMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
export const requestReverseGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainChar),
    map(pipe(
      prop('direction'),
      getOppositeDirection,
      requestReverseGuardMove,
    )),
  )

// moveGuardianEpic :: Epic -> [Observable Action *]
export const moveGuardianEpic = action$ =>
  zip(
    action$.pipe(
      ofType(DESTINATION_TILE_FOUND),
      filter(isRegularGuard),
    ),
    action$.pipe(
      ofType(DESTINATION_TILE_FOUND),
      filter(isReverseGuard),
    ),
  ).pipe(
    filter(([ a1, a2 ]) => hasDistinctCoordinates(a1.tile, a2.tile)),
    mergeMap(rmap(moveCharacterOrMeh)),
  )

// gameOverEpic :: Epic -> Observable Action GAME_OVER
export const gameOverEpic = (action$, state$) =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    withLatestFrom(state$),
    map(([ _, state ]) => findTileWithCharacter(MAIN_CHARACTER.id)(state.Board)),
    filter(isNil),
    map(gameOver),
  )

// winGameEpic :: Epic -> Observable Action WIN_GAME
export const winGameEpic = (action$, state$) =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainChar),
    switchMap(() => zip(
      action$.pipe(
        ofType(MOVE_CHARACTER),
        filter(isReverseGuard),
      ),
      action$.pipe(
        ofType(MOVE_CHARACTER),
        filter(isRegularGuard),
      )
    ).pipe(
      withLatestFrom(state$),
      map(([ _, state ]) => [
        getWinTileA(state.Board),
        getWinTileB(state.Board),
      ]),
      filter(everyTileIsGuarded),
      map(winGame),
    ))
  )

// resetBoardEpic :: Epic -> Observable Action CLEAN
export const resetBoardEpic = action$ =>
  action$.pipe(
    ofType(RETRY),
    map(clear),
  )

export default combineEpics(
  gameOverEpic,
  keyEventToMoveActionEpic,
  moveGuardianEpic,
  moveMainCharacterEpic,
  obtainNextCoordinatesEpic,
  requestMainCharacterMoveEpic,
  requestRegularGuardianMoveEpic,
  requestReverseGuardianMoveEpic,
  resetBoardEpic,
  winGameEpic,
)
