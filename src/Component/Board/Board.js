import React from 'react'
import './Board.css'

export default ({
  lines,
  meh,
  retry,
  gameOver,
}) =>
  <main>
    <div data-is="main-board">
      {lines.map((line, idx) =>
        <section data-is="line" key={`line-${idx}`}>
          {line.map((tile, idx) => <Tile {...tile } key={`tile-${idx}`}/>)}
        </section>
      )}
    </div>

    <button onClick={retry}>RETRY</button>

    {meh && 'Cant move there, asshat'}

    {gameOver && <p className="game-over">GAME OVER</p>}
  </main>

const Tile = ({
  char,
  locked,
}) =>
  <div data-is="tile" className={`${locked ? 'is-locked' : ''}`}>
    {char && <Character {...char} />}
  </div>

const Character = ({
  image,
}) =>
  <div data-is="character">
    <img src={image} alt="icon" />
  </div>
