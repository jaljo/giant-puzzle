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
} from './../Util'
import {
  __,
  allPass,
  apply,
  complement,
  cond,
  filter as rfilter,
  ifElse,
  includes,
  isEmpty,
  isNil,
  map as rmap,
  o,
  omit,
  or,
  path,
  pipe,
  prop,
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
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
  MAIN_CHARACTER,
  mainCharMove,
  reverseGuardMove,
  regularGuardMove,
} from './../Redux/State/Characters'
import {
  gameOver,
  winGame,
  RETRY,
} from './../Redux/State/Game'

// tileToCoordinates :: Maybe Tile -> Maybe Coordinates
const tileToCoordinates = omit(['char', 'locked'])

// directionIs :: String -> [Any, Action] -> Boolean
const directionIs = key => ([ _, action ]) => action.direction === key

// isNotOutOfBounds :: Maybe Tile -> Boolean
const isNotOutOfBounds = tile => tile.x !== null && tile.y !== null

// isNotGuarded :: Tile -> Boolean
const isNotGuarded = pipe(
  path(['char', 'id']),
  complement(includes(__, [GUARDIAN_REGULAR.id, GUARDIAN_REVERSE.id])),
)

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

// tileIsFree :: Tile :: Boolean
const tileIsFree = allPass([isNotOutOfBounds, isNotLocked, isNotGuarded])

// haveNotTheSameDestination :: (Action.DESTINATION_TILE_FOUND, Action.DESTINATION_TILE_FOUND) -> Boolean
const haveNotTheSameDestination = (a, b) => or(
  a.targetTile.x !== b.targetTile.x,
  a.targetTile.y !== b.targetTile.y,
)

// moveCharacterOrMeh :: Action.DESTINATION_TILE_FOUND -> Action.MOVE_CHARACTER Action.MEH
const moveCharacterOrMeh = ifElse(
  o(tileIsFree, prop('targetTile')),
  action => moveCharacter(
    action.characterId,
    action.direction,
    tileToCoordinates(action.targetTile)
  ),
  meh,
)

// keyEventToMoveActionEpic :: Epic -> Observable Action ARROW_KEY_PRESSED
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
    map(([ action, state ]) => findTileWithCharacter(action.characterId)(state.Board)),
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
    // Observable [Coordinates, State] -> Observable Tile
    map(([ coordinates, state ]) => findTileByCoordinates(coordinates)(state.Board)),
    withLatestFrom(action$),
    map(([ tile, action ]) => destinationTileFound(
      action.characterId,
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
    filter(mainCharMove),
    map(moveCharacterOrMeh),
  )

// requestRegularGuardianMoveEpic :: Epic -> REQUEST_CHARACTER_MOVE
export const requestRegularGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(mainCharMove),
    map(o(requestRegularGuardMove, prop('direction'))),
  )

// requestReverseGuardianMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
export const requestReverseGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(mainCharMove),
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
      filter(regularGuardMove),
    ),
    action$.pipe(
      ofType(DESTINATION_TILE_FOUND),
      filter(reverseGuardMove),
    ),
  ).pipe(
    filter(apply(haveNotTheSameDestination)),
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

// charIsGuardian :: Tile -> Boolean
const charIsGuardian = pipe(
  path(['char', 'id']),
  includes(__, [GUARDIAN_REGULAR.id, GUARDIAN_REVERSE.id]),
)

// everyTileIsGuarded :: [Tile] -> Boolean
export const everyTileIsGuarded = pipe(
  rfilter(complement(charIsGuardian)),
  isEmpty,
)

// winGameEpic :: Epic -> Observable Action WIN_GAME
const winGameEpic = (action$, state$) =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(mainCharMove),
    switchMap(() => zip(
      action$.pipe(
        ofType(MOVE_CHARACTER),
        filter(a => a.characterId === GUARDIAN_REVERSE.id),
      ),
      action$.pipe(
        ofType(MOVE_CHARACTER),
        filter(a => a.characterId === GUARDIAN_REGULAR.id),
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
