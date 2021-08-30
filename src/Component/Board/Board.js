import React from 'react'
import './Board.scss'
import Character from './../Character'
import { isGoal } from './../../Util'

// Board :: Props -> React.Component
const Board = ({
  lines,
}) =>
  <div data-is="main-board">
    <div className="board-wrapper">
      {lines.map((line, idx) =>
        <section data-is="line" key={`line-${idx}`}>
          {line.map((tile, idx) => <Tile {...tile } key={`tile-${idx}`}/>)}
        </section>
      )}
    </div>
  </div>

// Tile :: Props -> React.Component
const Tile = ({
  char,
  x,
  y,
}) =>
  <div data-is="tile">
    {char && <Character {...char} isBurrowed={isGoal(x, y)} />}
  </div>

export default Board
