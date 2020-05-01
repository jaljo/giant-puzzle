import * as Util from './Util'

describe('Util/Coordinates', () => {
  it('determines goal coordinates', () => {
    expect(Util.isGoal(1, 4)).toBeTruthy()
    expect(Util.isGoal(3, 4)).toBeTruthy()
    expect(Util.isGoal(1, 3)).toBeFalsy()
    expect(Util.isGoal(3, 3)).toBeFalsy()
    expect(Util.isGoal(2, 4)).toBeFalsy()
  })

  it('determines if an object has specific coordinates', () => {
    expect(Util.hasCoordinates(1, 3)({ x: 1, y: 3 })).toBeTruthy()
    expect(Util.hasCoordinates(1, 3)({ x: 1, y: 4 })).toBeFalsy()
    expect(Util.hasCoordinates(2, 3)({ x: 1, y: 3 })).toBeFalsy()
  })

  it('determines it two objects have distinct coordinates', () => {
    expect(
      Util.haveDistinctCoordinates({ x: 1, y: 2 }, { x: 1, y: 2 })
    ).toBeFalsy()
    expect(
      Util.haveDistinctCoordinates({ x: 2, y: 2 }, { x: 1, y: 2 })
    ).toBeTruthy()
  })

  it('compute new coordinates from a direction', () => {
    expect(Util.getNextDirection(1, 1, 'up')).toEqual([1, 2])
    expect(Util.getNextDirection(1, 1, 'down')).toEqual([1, 0])
    expect(Util.getNextDirection(1, 1, 'left')).toEqual([0, 1])
    expect(Util.getNextDirection(1, 1, 'right')).toEqual([2, 1])
  })

  it('determines the oposite of a given direction', () => {
    expect(Util.getOppositeDirection('down')).toBe('up')
    expect(Util.getOppositeDirection('up')).toBe('down')
    expect(Util.getOppositeDirection('left')).toBe('right')
    expect(Util.getOppositeDirection('right')).toBe('left')
  })
})

describe('Util/KeyboardEvents', () => {
  it('determines if the pressed key is an arrow', () => {
    expect(Util.isArrowKeyPressed({ key: 'ArrowUp'})).toBeTruthy()
    expect(Util.isArrowKeyPressed({ key: 'ArrowDown'})).toBeTruthy()
    expect(Util.isArrowKeyPressed({ key: 'ArrowLeft'})).toBeTruthy()
    expect(Util.isArrowKeyPressed({ key: 'ArrowRight'})).toBeTruthy()
    expect(Util.isArrowKeyPressed({ key: ':ah:'})).toBeFalsy()
  })

  it('converts an arrow key to a direction', () => {
    expect(Util.keyboardEventToDirection({ key: 'ArrowUp'})).toBe('up')
    expect(Util.keyboardEventToDirection({ key: 'ArrowDown'})).toBe('down')
    expect(Util.keyboardEventToDirection({ key: 'ArrowLeft'})).toBe('left')
    expect(Util.keyboardEventToDirection({ key: 'ArrowRight'})).toBe('right')
  })
})

describe('Util/Tile', () => {
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
