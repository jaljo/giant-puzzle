import {
  findTileWithCharacter,
  findTileByCoordinates,
} from './../../Util'
import {
  INITIAL_STATE,
  arrowKeyPressed,
  clear,
  default as reducer,
  destinationTileFound,
  moveCharacter,
} from './Board'
import {
  MAIN_CHARACTER,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
} from './Characters'

describe('Redux :: State :: Board', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE)
    expect(INITIAL_STATE).toMatchSnapshot()
  })

  it('reduces arrowKeyPressed action', () => {
    const s1 = reducer(INITIAL_STATE, arrowKeyPressed('right'))

    expect(
      findTileWithCharacter(MAIN_CHARACTER.id)(s1).char.direction
    ).toBe('right')
    expect(
      findTileWithCharacter(GUARDIAN_REGULAR.id)(s1).char.direction
    ).toBe('right')
    expect(
      findTileWithCharacter(GUARDIAN_REVERSE.id)(s1).char.direction
    ).toBe('left')
  })

  it('reduces moveCharacter action', () => {
    const mockDestTile = { x: 0, y: 0, char: null }
    const dtf = destinationTileFound(MAIN_CHARACTER.id, 'up', mockDestTile)
    const s1 = reducer(INITIAL_STATE, moveCharacter(dtf))

    // the character should have been moved to the destination tile
    expect(
      findTileWithCharacter(MAIN_CHARACTER.id)(s1)
    ).toMatchObject({
      x: 0,
      y: 0,
    })

    // the character should have been removed from its original place
    expect(
      findTileByCoordinates(2, 2)(s1)
    ).toMatchObject({
      x: 2,
      y: 2,
      char: null,
    })

    // other characters should not have moved
    expect(
      findTileWithCharacter(GUARDIAN_REGULAR.id)(s1)
    ).toEqual(
      findTileWithCharacter(GUARDIAN_REGULAR.id)(INITIAL_STATE)
    )
    expect(
      findTileWithCharacter(GUARDIAN_REVERSE.id)(s1)
    ).toEqual(
      findTileWithCharacter(GUARDIAN_REVERSE.id)(INITIAL_STATE)
    )
  })

  it('reduces clear action', () => {
    expect(reducer([], clear())).toEqual(INITIAL_STATE)
  })
})
