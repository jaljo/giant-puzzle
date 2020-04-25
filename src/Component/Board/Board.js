import React from 'react'
import './Board.css'

export default ({
  lines,
  meh,
}) =>
  <main>
    <div data-is="main-board">
      {lines.map((line, idx) =>
        <section data-is="line" key={`line-${idx}`}>
          {line.map((tile, idx) => <Tile {...tile } key={`tile-${idx}`}/>)}
        </section>
      )}
    </div>

    {meh && 'Cant move there, asshat'}
  </main>

const Tile = ({
  x,
  y,
  char,
  locked,
}) =>
  <div data-is="tile" className={`${locked ? 'is-locked' : ''}`}>
    {`(${x}, ${y})`}
    {char && <Character {...char} />}
  </div>

const Character = ({
  name,
}) =>
  <div data-is="character">
    <img src="https://image.flaticon.com/icons/svg/2754/2754522.svg" alt="fuck" />
  </div>
