import { fromEvent, zip } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, filter, withLatestFrom, mergeMap } from 'rxjs/operators'
import {
  findTileByCoordinates,
  findTileWithCharacter,
  getWinTileA,
  getWinTileB,
  getOppositeDirection,
} from './../Util'
import {
  __,
  allPass,
  apply,
  complement,
  cond,
  dec,
  filter as rfilter,
  evolve,
  head,
  ifElse,
  inc,
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
  replace,
  toLower,
} from 'ramda'
import {
  ARROW_KEY_PRESSED,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
  MAIN_CHARACTER,
  MOVE_CHARACTER,
  NEXT_COORDINATES_OBTAINED,
  REQUEST_CHARACTER_MOVE,
  arrowKeyPressed,
  gameOver,
  meh,
  moveCharacter,
  nextCoordinatesObtained,
  requestCharacterMove,
  winGame,
} from './../Redux/State/Board'

// isMainCharacterMove :: Action -> Boolean
const isMainCharacterMove = action => action.characterId === MAIN_CHARACTER.id
const isRegularGuardianMove = action => action.characterId === GUARDIAN_REGULAR.id
const isReverseGuardianMove = action => action.characterId === GUARDIAN_REVERSE.id

// isArrowKeyPressed :: [String] -> KeyboardEvent -> Boolean
const isArrowKeyPressed = keyMap => pipe(
  prop('key'),
  includes(__, keyMap),
)

// keyEventToMoveActionEpic :: Epic -> Observable Action ARROW_KEY_PRESSED
const keyEventToMoveActionEpic = (action$, state$, { keyMap }) =>
  fromEvent(window, 'keyup').pipe(
    filter(isArrowKeyPressed(keyMap)),
    withLatestFrom(state$),
    filter(([ _, state ]) => !state.Board.gameOver),
    filter(([ _, state ]) => !state.Board.winGame),
    map(pipe(
      head,
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

// isNotGuarded :: Tile -> Boolean
const isNotGuarded = pipe(
  path(['char', 'id']),
  complement(includes(__, [GUARDIAN_REGULAR.id, GUARDIAN_REVERSE.id])),
)

// isNotLocked :: Tile -> Boolean
const isNotLocked = complement(prop('locked'))

// tileIsFree :: Tile :: Boolean
const tileIsFree = allPass([isNotOutOfBounds, isNotLocked, isNotGuarded])

// haveNotTheSameDestination :: (Action.NEXT_COORDINATES_OBTAINED, Action.NEXT_COORDINATES_OBTAINED) -> Boolean
const haveNotTheSameDestination = (a, b) => or(
  a.targetTile.x !== b.targetTile.x,
  a.targetTile.y !== b.targetTile.y,
)

// moveCharacterOrMeh :: Action.NEXT_COORDINATES_OBTAINED -> Action.MOVE_CHARACTER Action.MEH
const moveCharacterOrMeh = ifElse(
  o(tileIsFree, prop('targetTile')),
  action => moveCharacter(
    action.characterId,
    action.direction,
    tileToCoordinates(action.targetTile)
  ),
  o(meh, prop('characterId')),
)

// obtainNextCoordinatesEpic :: Epic -> Observable Action NEXT_COORDINATES_OBTAINED
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
    // Observable [Coordinates, State] -> Observable Tile
    map(([ coordinates, state ]) => findTileByCoordinates(coordinates)(state.Board.lines)),
    withLatestFrom(action$),
    map(([ tile, action ]) => nextCoordinatesObtained(
      action.characterId,
      action.direction,
      tile,
    )),
  )

// requestMainCharacterMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
const requestMainCharacterMoveEpic = action$ =>
  action$.pipe(
    ofType(ARROW_KEY_PRESSED),
    // @TODO inject characters id rather than using them directly
    map(action => requestCharacterMove(MAIN_CHARACTER.id, action.direction)),
  )

// moveMainCharacterEpic :: Epic -> Observable Action MOVE_CHARACTER MEH
const moveMainCharacterEpic = action$ =>
  action$.pipe(
    ofType(NEXT_COORDINATES_OBTAINED),
    filter(isMainCharacterMove),
    map(moveCharacterOrMeh),
  )

// requestRegularGuardianMoveEpic :: Epic -> REQUEST_CHARACTER_MOVE
const requestRegularGuardianMoveEpic = action$ =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    filter(isMainCharacterMove),
    // @TODO inject characters id rather than using them directly
    map(action => requestCharacterMove(GUARDIAN_REGULAR.id, action.direction)),
  )

// requestReverseGuardianMoveEpic :: Epic -> Observable Action REQUEST_CHARACTER_MOVE
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

// moveGuardianEpic :: Epic -> [Observable Action *]
const moveGuardianEpic = action$ =>
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
    filter(apply(haveNotTheSameDestination)),
    mergeMap(rmap(moveCharacterOrMeh)),
  )

// gameOverEpic :: Epic -> Observable Action GAME_OVER
const gameOverEpic = (action$, state$) =>
  action$.pipe(
    ofType(MOVE_CHARACTER),
    withLatestFrom(state$),
    map(([ _, state ]) => findTileWithCharacter(MAIN_CHARACTER.id)(state.Board.lines)),
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
      withLatestFrom(state$),
      map(([ _, state ]) => [
        getWinTileA(state.Board.lines),
        getWinTileB(state.Board.lines),
      ]),
      filter(everyTileIsGuarded),
      map(winGame),
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
  winGameEpic,
)
