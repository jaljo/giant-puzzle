import React from 'react'
import './Character.scss'

// Character :: Props -> React.Component
export default ({
  direction,
  asset
}) =>
  <div
    data-is="character"
    className={`${asset} ${direction}`}
  >
  </div>
