import React from 'react'
import { Provider } from 'react-redux'
import Board from './Board'

export default ({
  store,
}) =>
  <Provider store={store}>
    <Board />
  </Provider>
