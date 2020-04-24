import { fromEvent } from 'rxjs'
import { combineEpics } from 'redux-observable'
import { map, ignoreElements, tap, filter } from 'rxjs/operators'
import {
  __,
  includes,
  pipe,
  prop,
  cond,
} from 'ramda'
import { up, down, left, right } from './../Redux/State/Board'

// isArrowKeyPressed :: [String] -> KeyboardEvent -> Boolean
const isArrowKeyPressed = keyMap => pipe(
  prop('key'),
  includes(__, keyMap),
)

// moveMainCharacterEpic :: Epic -> Observable Action *
const moveMainCharacterEpic = (action$, state$, { keyMap }) =>
  fromEvent(window, 'keyup').pipe(
    filter(isArrowKeyPressed(keyMap)),
    map(cond([
      [event => event.key === 'ArrowUp', up],
      [event => event.key === 'ArrowDown', down],
      [event => event.key === 'ArrowLeft', left],
      [event => event.key === 'ArrowRight', right],
    ])),
    tap(console.warn),
    ignoreElements(),
  )

export default combineEpics(
  moveMainCharacterEpic,
)
