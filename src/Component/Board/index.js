import Board from './Board'
import { connect } from 'react-redux'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  lines: state.Board.lines,
})

// Board :: Props -> React.Component
export default connect(
  mapStateToProps,
)(Board)
