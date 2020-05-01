import React from 'react'
import renderer from 'react-test-renderer'
import Character from './Character'

describe('Component :: Character', () => {
  it('renders a character component', () => {
    const state = {
      direction: 'up',
      asset: 'fox',
      isBurrowed: false,
    }

    expect(
      renderer.create(<Character {...state} />)
    ).toMatchSnapshot()
  })

  it('renders a burrowed character component', () => {
    const state = {
      direction: 'down',
      asset: 'chick',
      isBurrowed: true,
    }

    expect(
      renderer.create(<Character {...state} />)
    ).toMatchSnapshot()
  })
})
