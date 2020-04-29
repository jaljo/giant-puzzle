import RightPanel from './RightPanel'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import { retry } from './../../Redux/State/Game'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  gameOver: state.Game.gameOver,
  gameWon: state.Game.winGame,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  retry: compose(dispatch, retry),
})

// RightPanel :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanel)
