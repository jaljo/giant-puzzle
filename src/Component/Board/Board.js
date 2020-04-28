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

// Tile :: Props -> React.Component
const Tile = ({
  char,
}) =>
  <div data-is="tile">
    {char && <Character {...char} />}
  </div>
