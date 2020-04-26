import Board from './Board'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  lines: state.Board.lines,
})

export default connect(
  mapStateToProps,
)(Board)
