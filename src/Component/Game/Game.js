import React from 'react'
import Board from './../Board'
import RightPanel from './../RightPanel'
import './Game.scss'

// Game :: () -> React.Component
const Game = () =>
  <div data-is="game">
    <section className="game-section board">
      <Board />
    </section>
    <section className="game-section right-panel">
      <RightPanel />
    </section>
  </div>

export default Game
