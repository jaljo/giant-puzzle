import Board from './Board'
import { connect } from 'react-redux'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  lines: state.Board,
})

// Board :: Props -> React.Component
export default connect(
  mapStateToProps,
)(Board)
