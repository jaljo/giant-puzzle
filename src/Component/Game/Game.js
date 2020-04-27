import React from 'react'
import Board from './../Board'
import './Game.scss'

// Game :: Props -> React.Component
export default ({
  retry,
  gameOver,
  gameWon,
}) =>
  <div data-is="game">
    <section className="game-section board">
      <Board />
    </section>
    <section className="game-section right-panel">
      <h1>La chasse aux poussins est ouverte !</h1>

      <p className="explanations">
        Utilises les flèches de ton clavier pour déplacer le
        &nbsp;
        <img src="/images/chick_face.png" alt="chick"/> et emmener les
        &nbsp;
        <img src="/images/fox_face.png" alt="fox" /> dans leur terrier
        &nbsp;
        <img src="/images/burrow.png" alt="burrow" />.
      </p>
      <p>Mais prend garde à ne pas te faire manger !</p>

      <button className="retry" onClick={retry}>
        Recommencer !
      </button>

      {gameOver && <p className="game-over">GAME OVER</p>}
      {gameWon && <p className="game-won">GG !</p>}
    </section>
  </div>
