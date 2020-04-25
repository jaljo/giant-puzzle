import { combineEpics } from 'redux-observable'
import Board from './Board'

// Epic :: (Observable Action, Observable State) -> Observable Action
export default combineEpics(
  Board,
)
