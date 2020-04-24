import { fromEvent } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import { map, ignoreElements, tap, filter, withLatestFrom } from 'rxjs/operators'
import {
  __,
  cond,
  dec,
  dissoc,
  evolve,
  filter as rfilter,
  flatten,
  head,
  inc,
  includes,
  isEmpty,
  map as rmap,
  pipe,
  prop,
  reject,
  o,
  complement,
  isNil,
  ifElse,
  allPass,
} from 'ramda'
import {
  up,
  down,
  left,
  right,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  MAIN_CHARACTER,
  meh,
  moveCharacter,
} from './../Redux/State/Board'

// isArrowKeyPressed :: [String] -> KeyboardEvent -> Boolean
const isArrowKeyPressed = keyMap => pipe(
  prop('key'),
  includes(__, keyMap),
)

// keyEventToMoveActionEpic :: Epic -> Observable Action *
const keyEventToMoveActionEpic = (action$, state$, { keyMap }) =>
  fromEvent(window, 'keyup').pipe(
    filter(isArrowKeyPressed(keyMap)),
    map(cond([
      [event => event.key === 'ArrowUp', up],
      [event => event.key === 'ArrowDown', down],
      [event => event.key === 'ArrowLeft', left],
      [event => event.key === 'ArrowRight', right],
    ])),
  )

// findCharacterInLine :: String -> [Tile] -> [Tile]
const findCharacterInLine = characterId => pipe(
  rfilter(tile => tile.char !== null && tile.char.id === characterId),
  reject(isEmpty),
)

// findTileWithCharacter :: String -> [[Tile]] -> Tile
const findTileWithCharacter = characterId => pipe(
  rmap(findCharacterInLine(characterId)),
  reject(isEmpty),
  flatten,
  head,
)

// findTileInLine :: Coordinates -> [Tile] -> [Tile]
const findTileInLine = coord => pipe(
  rfilter(tile => tile.x === coord.x && tile.y === coord.y),
  reject(isEmpty),
)

// findTileByCoordinates :: Coordinates -> [[Tile]] -> Maybe Tile
const findTileByCoordinates = coord => pipe(
  rmap(findTileInLine(coord)),
  reject(isEmpty),
  flatten,
  head,
)

// toLeft :: Tile -> Coordinates
const toLeft = evolve({ x: dec })
const toRight = evolve({ x: inc })
const toUp = evolve({ y: inc })
const toDown = evolve({ y: dec })

// tileToCoordinates :: Tile -> Coordinates
const tileToCoordinates = dissoc('char')

// actionIs :: String -> [Any, Action] -> Boolean
const actionIs = actionType => ([ _, action ]) => action.type === actionType

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
    ofType(UP, DOWN, LEFT, RIGHT),
    withLatestFrom(state$),
    // find the tile where the main character is
    // Observable [Action, State] -> Observable Tile
    map(([ _, state ]) => findTileWithCharacter(MAIN_CHARACTER.id)(state.Board)),
    withLatestFrom(action$),
    // compute target coordinates
    // Observable [Tile, Action] -> Observable Coordinates
    map(pipe(
      cond([
        [actionIs(UP), ([ tile ]) => toUp(tile)],
        [actionIs(DOWN), ([ tile ]) => toDown(tile)],
        [actionIs(LEFT), ([ tile ]) => toLeft(tile)],
        [actionIs(RIGHT), ([ tile ]) => toRight(tile)],
      ]),
      tileToCoordinates,
    )),
    withLatestFrom(state$),
    // find the tile matching the target coordinates (if any)
    // Observable [Coordinates, State] -> Observable [Maybe Tile]
    map(([ coordinates, state ]) => findTileByCoordinates(coordinates)(state.Board)),
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
