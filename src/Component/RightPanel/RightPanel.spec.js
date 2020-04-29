import RightPanel from './RightPanel'
import React from 'react'
import renderer from 'react-test-renderer'

describe('Component/RightPanel', () => {
  it('renders the welcome message when the game is neither won or lost', () => {
    const state = {
      gameWon: false,
      gameOver: false,
    }

    expect(
      renderer.create(<RightPanel {...state} />)
    ).toMatchSnapshot()
  })

  it('renders the win message when the game is won', () => {
    const state = {
      gameWon: true,
    }

    expect(
      renderer.create(<RightPanel {...state} />)
    ).toMatchSnapshot()
  })

  it('renders the game over message when the game is lost', () => {
    const state = {
      gameOver: true,
    }

    expect(
      renderer.create(<RightPanel {...state} />)
    ).toMatchSnapshot()
  })
})
