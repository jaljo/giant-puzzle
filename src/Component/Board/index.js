import Board from './Board'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import {retry } from './../../Redux/State/Board'

const mapStateToProps = state => ({
  lines: state.Board.lines,
  meh: state.Board.meh,
  gameOver: state.Board.gameOver,
  gameWon: state.Board.winGame,
})

const mapDispatchToProps = dispatch => ({
  retry: compose(dispatch, retry),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board)
