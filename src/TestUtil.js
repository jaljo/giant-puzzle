import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { default as mainReducer } from './Redux/State'
import React from 'react'

// createTestStore :: () -> Store
export const createTestStore = () => createStore(mainReducer)

// createContainer :: (React.Component, Store) -> React.Component
export const createContainer = (component, store) => renderer.create(
  <Provider store={store}>
    {component}
  </Provider>
)
