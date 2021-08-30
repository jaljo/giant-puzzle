import React from 'react'
import './Character.scss'

// Character :: Props -> React.Component
const Character = ({
  asset,
  direction,
  isBurrowed,
}) =>
  <div
    data-is="character"
    className={`${asset} ${direction} ${isBurrowed ? 'is-burrowed' : ''}`}
  >
  </div>

export default Character
