import Board from './Board'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  lines: state.Board,
})

export default connect(
  mapStateToProps,
)(Board)
