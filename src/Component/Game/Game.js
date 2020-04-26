import React from 'react'
import Board from './../Board'

export default ({
  meh,
  retry,
  gameOver,
  gameWon,
}) =>
  <div data-is="game">
    <section className="board">
      <Board />
    </section>
    <section className="right-panel">
      <button onClick={retry}>RETRY</button>

      {meh && 'Cant move there, asshat'}

      {gameOver && <p className="game-over">GAME OVER</p>}
      {gameWon && <p className="game-won">GG ! Here's the fucking code : F.U.C.K</p>}
    </section>
  </div>
