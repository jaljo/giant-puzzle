import * as Util from './Util'

describe('Util', () => {
  it('find a tile by its coordinates in a tile set', () => {
    const set = [
      [ {x: 0, y: 0}, {x: 1, y: 0} ]
    ]

    expect(
      Util.findTileByCoordinates(1, 0)(set)
    ).toEqual({
      x: 1,
      y: 0,
    })
  })
})
