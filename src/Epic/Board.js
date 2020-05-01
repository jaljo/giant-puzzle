import { fromEvent, zip } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import {
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators'
import {
  findTileByCoordinates,
  findTileWithCharacter,
  getNextDirection,
  getOppositeDirection,
  getWinTileA,
  getWinTileB,
  haveDistinctCoordinates,
  isArrowKeyPressed,
  keyboardEventToDirection,
} from './../Util'
import {
  allPass,
  complement,
  filter as rfilter,
  isEmpty,
  isNil,
  map as rmap,
  o,
  pick,
  pipe,
  prop,
  propOr,
  values,
} from 'ramda'
import {
  ARROW_KEY_PRESSED,
  DESTINATION_TILE_FOUND,
  MOVE_CHARACTER,
  REQUEST_CHARACTER_MOVE,
  arrowKeyPressed,
  clear,
  destinationTileFound,
  moveCharacter,
  requestMainCharMove,
  requestRegularGuardMove,
  requestReverseGuardMove,
} from './../Redux/State/Board'
import {
  MAIN_CHARACTER,
  isGuardian,
  isMainChar,
  isRegularGuard,
  isReverseGuard,
} from './../Redux/State/Characters'
import {
  RETRY,
  gameOver,
  winGame,
} from './../Redux/State/Game'

// isNotOutOfBounds :: Tile -> Boolean
const isNotOutOfBounds = tile => tile.x !== null && tile.y !== null

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

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
export const tileIsFree = allPass([isNotOutOfBounds, isNotLocked, isNotGuarded])

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
    // find the tile current cooordinates of the character
    // Observable [Action, State] -> Observable [Number, Number]
    map(pipe(
      ([ action, state ]) => findTileWithCharacter(action.id)(state.Board),
      pick(['x', 'y']),
      values,
    )),
    withLatestFrom(action$),
    // compute target coordinates
    // Observable [ [Number, Number], Action ] -> Observable [Number, Number]
    map(([ [ x, y ], action ]) => getNextDirection(x, y, action.direction)),
    withLatestFrom(state$),
    // find the tile matching the target coordinates (if any)
    // Observable [ [Number, Number], State] -> Observable Tile
    map(([ [ x, y ], state ]) => findTileByCoordinates(x, y)(state.Board)),
    withLatestFrom(action$),
    map(([ tile, a ]) => destinationTileFound(a.id, a.direction, tile)),
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
    filter(o(tileIsFree, prop('tile'))),
    map(moveCharacter),
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

// moveGuardiansEpic :: Epic -> [Observable Action *]
export const moveGuardiansEpic = action$ =>
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
    filter(([ a1, a2 ]) => haveDistinctCoordinates(a1.tile, a2.tile)),
    mergeMap(pipe(
      rfilter(o(tileIsFree, prop('tile'))),
      rmap(moveCharacter),
    )),
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
  moveGuardiansEpic,
  moveMainCharacterEpic,
  obtainNextCoordinatesEpic,
  requestMainCharacterMoveEpic,
  requestRegularGuardianMoveEpic,
  requestReverseGuardianMoveEpic,
  resetBoardEpic,
  winGameEpic,
)
