import React from 'react'
import './Board.css'

export default ({
  lines,
  meh,
  retry,
  gameOver,
  gameWon,
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
    {gameWon && <p className="game-won">GG ! Here's the fucking code : F.U.C.K</p>}
  </main>

// isGoal :: (Number, Number) -> Boolean
const isGoal = (x , y) => y === 4 && (x === 1 || x === 3)

// Tile :: Props -> React.Component
const Tile = ({
  x,
  y,
  char,
  locked,
}) =>
  <div
    data-is="tile"
    className={`${locked ? 'is-locked' : ''} ${isGoal(x,y) ? 'goal' : '' }`}
  >
    {char && <Character {...char} />}
  </div>

// Character :: Props -> React.Component
const Character = ({
  direction,
  asset
}) =>
  <div data-is="character" className={`${asset} ${direction}`}>
    {direction}
  </div>
