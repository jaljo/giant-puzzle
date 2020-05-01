import * as epic from './Board'
import * as state from './../Redux/State/Board'
import * as game from './../Redux/State/Game'
import {
  MAIN_CHARACTER,
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
} from './../Redux/State/Characters'
import { ActionsObservable } from 'redux-observable'
import {
  createStateObservable,
  createTestScheduler,
} from './../TestUtil'

describe('Epic :: Board :: utils', () => {
  it('determines if every tiles of a set are guarded', () => {
    const set1 = [
      { char: GUARDIAN_REGULAR },
      { char: GUARDIAN_REVERSE },
    ]

    expect(epic.everyTileIsGuarded(set1)).toBeTruthy()

    const set2 = [
      { char: GUARDIAN_REGULAR },
      { char: null },
    ]
    expect(epic.everyTileIsGuarded(set2)).toBeFalsy()
  })

  it('determines if a tile is a valid destination', () => {
    expect(
      epic.tileIsFree({ x: 0, y: 1, locked: false, char: null })
    ).toBeTruthy()

    // out of bounds
    expect(
      epic.tileIsFree({ x: null, y: null, locked: false, char: null })
    ).toBeFalsy()

    // locked
    expect(
      epic.tileIsFree({ x: 0, y: 1, locked: true, char: null })
    ).toBeFalsy()

    // has a guardian on
    expect(
      epic.tileIsFree({ x: 0, y: 1, locked: false, char: GUARDIAN_REGULAR })
    ).toBeFalsy()
    expect(
      epic.tileIsFree({ x: 0, y: 1, locked: false, char: GUARDIAN_REVERSE })
    ).toBeFalsy()
  })
})

describe('Epic :: Board :: findDestinationTileEpic', () => {
  it('dispatches DESTINATION_TILE_FOUND_ACTION', done => {
    // original position of main char is (2, 2) and it moves left
    const action$ = ActionsObservable.of(state.requestMainCharMove('left'))
    const state$ = createStateObservable({ Board: state.INITIAL_STATE })

    epic.findDestinationTileEpic(action$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.DESTINATION_TILE_FOUND)
        expect(action.tile).toMatchObject({
          x: 1,
          y: 2,
          char: null,
          locked: false,
        })
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)
})

describe('Epic :: Board :: requestMainCharacterMoveEpic', () => {
  it('dispatches REQUEST_CHARACTER_MOVE action', done => {
    const action$ = ActionsObservable.of(state.arrowKeyPressed('left'))

    epic.requestMainCharacterMoveEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.REQUEST_CHARACTER_MOVE)
        expect(action.id).toBe(MAIN_CHARACTER.id)
        expect(action.direction).toBe('left')
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)
})

describe('Epic :: Board :: moveMainCharacterEpic', () => {
  it('dispatches MOVE_CHARACTER action', done => {
    const mockTile = { x: 1, y: 2, locked: false, char: null }
    const action$ = ActionsObservable.of(
      state.destinationTileFound(MAIN_CHARACTER.id, 'left', mockTile)
    )

    epic.moveMainCharacterEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.MOVE_CHARACTER)
        expect(action.id).toBe(MAIN_CHARACTER.id)
        expect(action.direction).toBe('left')
        expect(action.x).toBe(1)
        expect(action.y).toBe(2)
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)

  it('dispatches NOTHING if the moved character os not the main one', done => {
    const mockTile = { x: 1, y: 1, locked: false, char: null }
    const action$ = ActionsObservable.of(
      state.destinationTileFound(GUARDIAN_REGULAR.id, 'left', mockTile)
    )

    epic.moveMainCharacterEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action).toBeUndefined()
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)

  it('dispatches NOTHING if the destination tile is not valid', done => {
    const mockTile = { x: 1, y: 1, locked: true, char: null }
    const action$ = ActionsObservable.of(
      state.destinationTileFound(MAIN_CHARACTER.id, 'left', mockTile)
    )

    epic.moveMainCharacterEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action).toBeUndefined()
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)
})

describe('Epic :: Board :: requestRegularGuardianMoveEpic', () => {
  it('dispatches REQUEST_CHARACTER_MOVE action', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({
        id: MAIN_CHARACTER.id,
        direction: 'right',
        tile: {}
      })
    )

    epic.requestRegularGuardianMoveEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.REQUEST_CHARACTER_MOVE)
        expect(action.id).toBe(GUARDIAN_REGULAR.id)
        expect(action.direction).toBe('right')
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)

  it('dispatches NOTHING if the moved character is not the main one', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({
        id: GUARDIAN_REGULAR.id,
        direction: 'right',
        tile: {}
      })
    )

    epic.requestRegularGuardianMoveEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action).toBeUndefined()
        done()
      })
      .catch(error => { fail(error); done() })
  })
})

describe('Epic :: Board :: requestReverseGuardianMoveEpic', () => {
  it('dispatches REQUEST_CHARACTER_MOVE action', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({
        id: MAIN_CHARACTER.id,
        direction: 'up',
        tile: {}
      })
    )

    epic.requestReverseGuardianMoveEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.REQUEST_CHARACTER_MOVE)
        expect(action.id).toBe(GUARDIAN_REVERSE.id)
        // the requested direction should be the opposite of the main character
        expect(action.direction).toBe('down')
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)

  it('dispatches NOTHING if the moved character is not the main one', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({
        id: GUARDIAN_REGULAR.id,
        direction: 'right',
        tile: {}
      })
    )

    epic.requestReverseGuardianMoveEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action).toBeUndefined()
        done()
      })
      .catch(error => { fail(error); done() })
  })
})

describe('Epic :: Board :: moveGuardiansEpic', () => {
  it('dispatches two MOVE_CHARACTER actions', () => {
    const mockTileA = { x: 0, y: 1, locked: false, char: null }
    const mockTileB = { x: 0, y: 2, locked: false, char: null }

    createTestScheduler().run(({ hot, cold, expectObservable }) => {
      const action$ = hot('ab', {
        a: state.destinationTileFound(GUARDIAN_REGULAR.id, 'up', mockTileA),
        b: state.destinationTileFound(GUARDIAN_REVERSE.id, 'down', mockTileB),
      })

      expectObservable(
        epic.moveGuardiansEpic(action$)
      ).toBe('-(ab)', {
        a: state.moveCharacter({
          id: GUARDIAN_REGULAR.id,
          direction: 'up',
          tile: mockTileA,
        }),
        b: state.moveCharacter({
          id: GUARDIAN_REVERSE.id,
          direction: 'down',
          tile: mockTileB,
        }),
      })
    })
  })

  it('dispatches only one MOVE_CHARACTER actions when some destination is invalid', () => {
    const mockTileA = { x: 0, y: 1, locked: false, char: null }
    const mockTileB = { x: 0, y: 2, locked: true, char: null }

    createTestScheduler().run(({ hot, cold, expectObservable }) => {
      const action$ = hot('ab', {
        a: state.destinationTileFound(GUARDIAN_REGULAR.id, 'up', mockTileA),
        b: state.destinationTileFound(GUARDIAN_REVERSE.id, 'down', mockTileB),
      })

      expectObservable(
        epic.moveGuardiansEpic(action$)
      ).toBe('-a', {
        a: state.moveCharacter({
          id: GUARDIAN_REGULAR.id,
          direction: 'up',
          tile: mockTileA,
        }),
      })
    })
  })

  it('dispatches NOTHING when the two guardians try to move to the same destination', () => {
    const mockTile = { x: 0, y: 1, locked: false, char: null }

    createTestScheduler().run(({ hot, cold, expectObservable }) => {
      const action$ = hot('ab', {
        a: state.destinationTileFound(GUARDIAN_REGULAR.id, 'up', mockTile),
        b: state.destinationTileFound(GUARDIAN_REVERSE.id, 'down', mockTile),
      })

      expectObservable(
        epic.moveGuardiansEpic(action$)
      ).toBe('')
    })
  })
})

describe('Epic :: Board :: gameOverEpic', () => {
  it('dispatches GAME_OVER action when the main character has been eaten', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({ tile: {} })
    )
    const state$ = createStateObservable({
      Board: [
        [ { x: 0, y: 0, locked: false, char: null }]
      ]
    })

    epic.gameOverEpic(action$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(game.GAME_OVER)
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)

  it('dispatches NOTHING when the main character still exists', done => {
    const action$ = ActionsObservable.of(
      state.moveCharacter({ tile: {} })
    )
    const state$ = createStateObservable({
      Board: [
        [ { x: 0, y: 0, locked: false, char: MAIN_CHARACTER }]
      ]
    })

    epic.gameOverEpic(action$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action).toBeUndefined()
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)
})

describe('Epic :: Board :: winGameEpic', () => {
  const moveMain = state.moveCharacter({
    id: MAIN_CHARACTER.id,
    tile: {},
  })
  const moveGuardianA = state.moveCharacter({
    id: GUARDIAN_REGULAR.id,
    tile: { x: 1, y: 4 },
  })
  const moveGuardianB = state.moveCharacter({
    id: GUARDIAN_REVERSE.id,
    tile: { x: 3, y: 4 },
  })

  it('dispatches WIN_GAME action when both guards are on goal tiles', () => {
    createTestScheduler().run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a bc', {
        a: moveMain,
        b: moveGuardianA,
        c: moveGuardianB,
      })

      // we artificially move guardians so they are on the goal tiles
      const s1 = state.default(state.INITIAL_STATE, moveGuardianA)
      const s2 = state.default(s1, moveGuardianB)
      const state$ = createStateObservable({ Board: s2 })

      expectObservable(
        epic.winGameEpic(action$, state$)
      ).toBe('--a', {
        a: game.winGame()
      })
    })
  })

  it('dispatches NOTHING if the win conditions are not fullfiled', () => {
    createTestScheduler().run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a bc', {
        a: moveMain,
        b: moveGuardianA,
        c: moveGuardianB,
      })

      const state$ = createStateObservable({ Board: state.INITIAL_STATE })

      expectObservable(
        epic.winGameEpic(action$, state$)
      ).toBe('')
    })
  })
})

describe('Epic :: Board :: resetBoardEpic', () => {
  it('dispatches CLEAR action', done => {
    const action$ = ActionsObservable.of(game.retry())

    epic.resetBoardEpic(action$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toBe(state.CLEAR)
        done()
      })
      .catch(error => { fail(error); done() })
  }, 1000)
})
