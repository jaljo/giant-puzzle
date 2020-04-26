import React from 'react'
import './Board.scss'
import Character from './../Character'

// Board :: Props -> React.Component
export default ({
  lines,
}) =>
  <div data-is="main-board">
    {lines.map((line, idx) =>
      <section data-is="line" key={`line-${idx}`}>
        {line.map((tile, idx) => <Tile {...tile } key={`tile-${idx}`}/>)}
      </section>
    )}
  </div>

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


