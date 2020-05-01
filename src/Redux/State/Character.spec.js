import {
  GUARDIAN_REGULAR,
  GUARDIAN_REVERSE,
  MAIN_CHARACTER,
  getCharInitialPos,
  isGuardian,
  isMainChar,
  isRegularCharacter,
  isRegularGuard,
  isReverseGuard,
} from './Characters'

describe('Redux :: State :: Characters', () => {
  it('can determine characters initial position', () => {
    expect(getCharInitialPos(1, 5)).toEqual(GUARDIAN_REVERSE)
    expect(getCharInitialPos(2, 2)).toEqual(MAIN_CHARACTER)
    expect(getCharInitialPos(2, 0)).toEqual(GUARDIAN_REGULAR)
  })

  it('determines if a character moves the regular way', () => {
    expect(isRegularCharacter(GUARDIAN_REVERSE.id)).toBeFalsy()
    expect(isRegularCharacter(MAIN_CHARACTER.id)).toBeTruthy()
    expect(isRegularCharacter(GUARDIAN_REGULAR.id)).toBeTruthy()
  })

  it('identifies the main character', () => {
    expect(isMainChar(GUARDIAN_REVERSE)).toBeFalsy()
    expect(isMainChar(MAIN_CHARACTER)).toBeTruthy()
    expect(isMainChar(GUARDIAN_REGULAR)).toBeFalsy()
  })

  it('identifies the regular guard', () => {
    expect(isRegularGuard(GUARDIAN_REVERSE)).toBeFalsy()
    expect(isRegularGuard(MAIN_CHARACTER)).toBeFalsy()
    expect(isRegularGuard(GUARDIAN_REGULAR)).toBeTruthy()
  })

  it('identifies the reverse guard', () => {
    expect(isReverseGuard(GUARDIAN_REVERSE)).toBeTruthy()
    expect(isReverseGuard(MAIN_CHARACTER)).toBeFalsy()
    expect(isReverseGuard(GUARDIAN_REGULAR)).toBeFalsy()
  })

  it('identifies a guardian', () => {
    expect(isGuardian(GUARDIAN_REVERSE)).toBeTruthy()
    expect(isGuardian(GUARDIAN_REGULAR)).toBeTruthy()
    expect(isGuardian(MAIN_CHARACTER)).toBeFalsy()
  })
})
