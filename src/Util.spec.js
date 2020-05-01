import * as Util from './Util'

describe('Util/Tile', () => {
  it('determines if a tile is not out of bounds', () => {
    expect(Util.isNotOutOfBounds({ x: 1, y: 1})).toBeTruthy()
    expect(Util.isNotOutOfBounds({ x: null, y: 1})).toBeFalsy()
    expect(Util.isNotOutOfBounds({ x: 1, y: null})).toBeFalsy()
    expect(Util.isNotOutOfBounds({ x: null, y: null})).toBeFalsy()
  })

  it('determines if a tile is locked', () => {
    expect(Util.isNotLocked({ locked: false })).toBeTruthy()
    expect(Util.isNotLocked({ locked: true })).toBeFalsy()
  })

  it('determines if coordinates exists in a tile set', () => {
    const set = [
      {x: 0, y: 1},
      {x: 1, y: 1},
    ]

    expect(Util.coordsExistsInTileSet(set)(0,1)).toBeTruthy()
    expect(Util.coordsExistsInTileSet(set)(0,10)).toBeFalsy()
  })

  it('find a character by coordinates in a tile set', () => {
    const mockChar = { id: 'hi' }
    const set = [
      {x: 0, y: 1, char: null},
      {x: 1, y: 1, char: mockChar},
    ]

    expect(
      Util.getCharByCoordinates(set)(1,1)
    ).toEqual(mockChar)

    expect(
      Util.getCharByCoordinates(set)(1,10)
    ).toEqual(null)
  })

  it('find a tile that holds a character in a tile set', () => {
    const mockChar = { id: 'hi' }
    const set = [
      [ {x: 0, y: 1, char: null}, {x: 1, y: 1, char: mockChar} ],
      [ {x: 0, y: 0, char: null}, {x: 1, y: 0, char: null} ],
    ]

    expect(
      Util.findTileWithCharacter('hi')(set)
    ).toEqual({
      x: 1,
      y: 1,
      char: mockChar,
    })
  })

  it('find a tile by its coordinates in a tile set', () => {
    const set = [
      [ {x: 0, y: 1}, {x: 1, y: 1} ],
      [ {x: 0, y: 0}, {x: 1, y: 0} ],
    ]

    expect(
      Util.findTileByCoordinates(1, 0)(set)
    ).toEqual({
      x: 1,
      y: 0,
    })
  })
})
