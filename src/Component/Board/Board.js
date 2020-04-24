import React from 'react'
import './Board.css'

export default ({
  lines
}) =>
  <div data-is="main-board">
    {lines.map((line, idx) =>
      <section data-is="line" key={`line-${idx}`}>
        {line.map((tile, idx) => <Tile {...tile } key={`tile-${idx}`}/>)}
      </section>
    )}
  </div>

const Tile = ({
  x,
  y,
  char,
}) =>
    <div data-is="tile">
      {`(${x}, ${y})`}
      {char && <Character {...char} />}
    </div>

const Character = ({
  name,
}) =>
  <div data-is="character">
    {name}
  </div>
