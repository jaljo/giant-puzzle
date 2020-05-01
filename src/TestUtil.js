import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { default as mainReducer } from './Redux/State'
import React from 'react'
import { StateObservable } from 'redux-observable'
import { Subject } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'

// createTestStore :: () -> Store
export const createTestStore = () => createStore(mainReducer)

// createContainer :: (React.Component, Store) -> React.Component
export const createContainer = (component, store) => renderer.create(
  <Provider store={store}>
    {component}
  </Provider>
)

// createStateObservable :: State -> Observable State
export const createStateObservable = state => new StateObservable(
  new Subject(),
  state,
)

export const createTestScheduler = () => new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});
