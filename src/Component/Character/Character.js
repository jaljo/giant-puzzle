import React from 'react'
import './Character.scss'

// Character :: Props -> React.Component
export default ({
  asset,
  direction,
  isBurrowed,
}) =>
  <div
    data-is="character"
    className={`${asset} ${direction} ${isBurrowed ? 'is-burrowed' : ''}`}
  >
  </div>
