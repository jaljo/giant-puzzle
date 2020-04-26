import React from 'react'
import { Provider } from 'react-redux'
import Game from './Game'

export default ({
  store,
}) =>
  <Provider store={store}>
    <Game />
  </Provider>
