import Game from './Game'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import {retry } from './../../Redux/State/Board'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  gameOver: state.Board.gameOver,
  gameWon: state.Board.winGame,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  retry: compose(dispatch, retry),
})

// Game :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
