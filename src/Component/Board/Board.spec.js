import React from 'react'
import renderer from 'react-test-renderer'
import Board from './Board'

describe('Component/Board', () => {
  it('renders a board with an empty tile and a tile with a character', () => {
    const mockChar = {
      asset: 'fox',
      direction: 'down',
    }

    const mockLines = [
      [
        { x: 0, y: 0, char: null },
        { x: 0, y: 0, char: mockChar },
      ]
    ]

    expect(
      renderer.create(<Board lines={mockLines} /> )
    ).toMatchSnapshot()
  })
})
