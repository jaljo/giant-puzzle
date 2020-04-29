import React from 'react'
import renderer from 'react-test-renderer'
import Character from './Character'

describe('Component/Character', () => {
  it('renders a character component', () => {
    expect(
      renderer.create(<Character direction="up" asset="fox" />)
    ).toMatchSnapshot()
  })
})
