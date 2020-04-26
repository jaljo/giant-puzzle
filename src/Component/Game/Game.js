import React from 'react'
import Board from './../Board'
import './Game.scss'

// Game :: Props -> React.Component
export default ({
  meh,
  retry,
  gameOver,
  gameWon,
}) =>
  <div data-is="game">
    <section className="game-section board">
      <Board />
    </section>
    <section className="game-section right-panel">
      <button onClick={retry}>RETRY</button>

      {meh && 'Cant move there, asshat'}

      {gameOver && <p className="game-over">GAME OVER</p>}
      {gameWon && <p className="game-won">GG !</p>}
    </section>
  </div>
