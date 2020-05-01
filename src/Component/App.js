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
    <p data-is="signature">
      Developed with love by <a href="https://github.com/jaljo/giant-puzzle">jaljo</a>.
      &nbsp;
      Design by <a href="https://comigo.itch.io/farm-puzzle-animals">CoMiGo</a>.
    </p>
  </Provider>
