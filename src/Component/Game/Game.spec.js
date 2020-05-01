import Game from './Game'
import React from 'react'
import { createTestStore, createContainer } from './../../TestUtil'

describe('Component :: Game', () => {
  let store

  beforeEach(() => {
    store = createTestStore()
  })

  it('has a board', () => {
    const inspector = createContainer(<Game />, store).root

    inspector.findByProps({ className: 'game-section board' })
  })

  it('has a right panel', () => {
    const inspector = createContainer(<Game />, store).root

    inspector.findByProps({ className: 'game-section right-panel' })
  })
})
