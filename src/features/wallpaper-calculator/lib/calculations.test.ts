import { describe, expect, it } from 'vitest'
import {
  applyWaste,
  calculateAdjustedStripHeight,
  calculateNetWallArea,
  calculateOpeningsArea,
  calculatePerimeter,
  calculateRollsByArea,
  calculateRollsByStrips,
  calculateStripsNeeded,
  calculateStripsPerRoll,
  calculateWallArea,
  calculateWallpaper,
  isValidNonNegativeInteger,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from './calculations'
import type { WallpaperInput } from '../types/wallpaper'

const input = (overrides: Partial<WallpaperInput> = {}): WallpaperInput => ({
  roomLength: 5,
  roomWidth: 4,
  wallHeight: 2.7,
  windowsCount: 1,
  windowWidth: 1.5,
  windowHeight: 1.4,
  doorsCount: 1,
  doorWidth: 0.9,
  doorHeight: 2,
  extraOpeningsArea: 0,
  rollWidth: 1.06,
  rollLength: 10,
  wastePercent: 10,
  usePatternRepeat: false,
  patternRepeat: 0.64,
  rollPrice: 1200,
  ...overrides,
})

describe('wallpaper geometry', () => {
  it('calculates perimeter and gross wall area', () => {
    expect(calculatePerimeter(5, 4)).toBe(18)
    expect(calculateWallArea(18, 2.7)).toBeCloseTo(48.6)
  })

  it('calculates openings area', () => {
    expect(calculateOpeningsArea(input())).toBeCloseTo(3.9)
    expect(calculateOpeningsArea(input({ extraOpeningsArea: 2 }))).toBeCloseTo(5.9)
  })

  it('calculates net wall area', () => {
    expect(calculateNetWallArea(48.6, 3.9)).toBeCloseTo(44.7)
  })

  it('does not return a negative net wall area', () => {
    expect(calculateNetWallArea(10, 12)).toBe(0)
  })

  it('applies waste percent', () => {
    expect(applyWaste(44.7, 10)).toBeCloseTo(49.17)
  })
})

describe('wallpaper rolls', () => {
  it('calculates strips per roll', () => {
    expect(calculateStripsPerRoll(10, 2.7)).toBe(3)
  })

  it('calculates strips needed', () => {
    expect(calculateStripsNeeded(18, 1.06)).toBe(17)
  })

  it('calculates rolls by strips', () => {
    expect(calculateRollsByStrips(17, 3)).toBe(6)
  })

  it('calculates rolls by area', () => {
    expect(calculateRollsByArea(49.17, 10.6)).toBe(5)
  })

  it('uses the safer maximum of area and strip calculations', () => {
    const result = calculateWallpaper(input())
    expect(result?.rollsByArea).toBe(5)
    expect(result?.rollsByStrips).toBe(6)
    expect(result?.recommendedRolls).toBe(6)
    expect(result?.calculationBasis).toBe('strips')
    expect(result?.totalCost).toBe(7200)
  })
})

describe('wallpaper pattern repeat', () => {
  it('calculates adjusted strip height', () => {
    expect(calculateAdjustedStripHeight(2.7, true, 0.64)).toBeCloseTo(3.2)
  })

  it('uses pattern repeat in the full calculation', () => {
    const result = calculateWallpaper(input({ usePatternRepeat: true, patternRepeat: 0.64 }))
    expect(result?.adjustedStripHeight).toBeCloseTo(3.2)
    expect(result?.stripsPerRoll).toBe(3)
    expect(result?.recommendedRolls).toBe(6)
  })

  it('returns null when adjusted strip height is longer than the roll', () => {
    expect(calculateWallpaper(input({ rollLength: 5, wallHeight: 3.5, usePatternRepeat: true, patternRepeat: 6 }))).toBeNull()
  })
})

describe('wallpaper validation', () => {
  it('validates positive numbers', () => {
    expect(isValidPositiveNumber(1)).toBe(true)
    expect(isValidPositiveNumber(0)).toBe(false)
    expect(isValidPositiveNumber(Number.NaN)).toBe(false)
    expect(isValidPositiveNumber(Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('validates non-negative numbers', () => {
    expect(isValidNonNegativeNumber(0)).toBe(true)
    expect(isValidNonNegativeNumber(-1)).toBe(false)
  })

  it('validates non-negative integers', () => {
    expect(isValidNonNegativeInteger(2)).toBe(true)
    expect(isValidNonNegativeInteger(2.5)).toBe(false)
    expect(isValidNonNegativeInteger(-1)).toBe(false)
  })

  it('rejects invalid input', () => {
    expect(calculateWallpaper(input({ roomLength: 0 }))).toBeNull()
    expect(calculateWallpaper(input({ wallHeight: 0 }))).toBeNull()
    expect(calculateWallpaper(input({ rollWidth: 0 }))).toBeNull()
    expect(calculateWallpaper(input({ rollLength: 0 }))).toBeNull()
    expect(calculateWallpaper(input({ windowsCount: -1 }))).toBeNull()
    expect(calculateWallpaper(input({ windowsCount: 1.5 }))).toBeNull()
    expect(calculateWallpaper(input({ wastePercent: -1 }))).toBeNull()
    expect(calculateWallpaper(input({ wastePercent: 101 }))).toBeNull()
    expect(calculateWallpaper(input({ roomWidth: Number.POSITIVE_INFINITY }))).toBeNull()
  })

  it('warns when openings exceed wall area', () => {
    const result = calculateWallpaper(input({
      windowsCount: 10,
      windowWidth: 3,
      windowHeight: 3,
    }))
    expect(result?.netWallArea).toBe(0)
    expect(result?.openingsExceedWalls).toBe(true)
  })
})
