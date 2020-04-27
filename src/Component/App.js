import React from 'react'
import { Provider } from 'react-redux'
import Game from './Game'
import './App.scss'

// App :: Props -> React.Component
export default ({
  store,
}) =>
  <Provider store={store}>
    <Game />
  </Provider>
