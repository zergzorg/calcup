import { describe, expect, it } from 'vitest'
import {
  calculateOpeningsArea,
  calculatePaint,
  calculatePaintCans,
  calculatePaintLiters,
  calculatePaintableArea,
  calculatePerimeter,
  calculateWallArea,
} from './calculations'
import type { PaintInput } from '../types/paint'

const baseInput: PaintInput = {
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
  coats: 2,
  coveragePerLiter: 10,
  wastePercent: 10,
  canVolume: 2.5,
  canPrice: 1200,
}

describe('paint calculations', () => {
  it('calculates room perimeter and gross wall area', () => {
    expect(calculatePerimeter(5, 4)).toBe(18)
    expect(calculateWallArea(18, 2.7)).toBe(48.6)
  })

  it('subtracts openings and extra areas', () => {
    expect(calculateOpeningsArea(baseInput)).toBeCloseTo(3.9, 2)
    expect(calculatePaintableArea(48.6, 3.9)).toBeCloseTo(44.7, 2)
  })

  it('calculates liters from area, coats, coverage and waste', () => {
    expect(calculatePaintLiters(44.7, 2, 10, 10)).toEqual({
      coatedArea: 89.4,
      baseLiters: 8.94,
      litersWithWaste: 9.83,
    })
  })

  it('rounds cans up to whole packages', () => {
    expect(calculatePaintCans(9.83, 2.5)).toBe(4)
    expect(calculatePaintCans(10, 2.5)).toBe(4)
    expect(calculatePaintCans(0, 2.5)).toBe(0)
  })

  it('returns complete paint estimate', () => {
    expect(calculatePaint(baseInput)).toMatchObject({
      grossWallArea: 48.6,
      openingsArea: 3.9,
      paintableArea: 44.7,
      coatedArea: 89.4,
      baseLiters: 8.94,
      litersWithWaste: 9.83,
      cansNeeded: 4,
      purchaseVolume: 10,
      leftoverLiters: 0.17,
      totalCost: 4800,
      openingsExceedWalls: false,
    })
  })

  it('keeps working when openings are larger than walls', () => {
    const result = calculatePaint({ ...baseInput, extraOpeningsArea: 100 })
    expect(result).toMatchObject({
      paintableArea: 0,
      litersWithWaste: 0,
      cansNeeded: 0,
      openingsExceedWalls: true,
    })
  })

  it('rejects invalid values', () => {
    expect(calculatePaint({ ...baseInput, roomLength: 0 })).toBeNull()
    expect(calculatePaint({ ...baseInput, coats: 0 })).toBeNull()
    expect(calculatePaint({ ...baseInput, coats: 1.5 })).toBeNull()
    expect(calculatePaint({ ...baseInput, coveragePerLiter: 0 })).toBeNull()
    expect(calculatePaint({ ...baseInput, wastePercent: -1 })).toBeNull()
    expect(calculatePaint({ ...baseInput, wastePercent: 101 })).toBeNull()
    expect(calculatePaint({ ...baseInput, canVolume: 0 })).toBeNull()
    expect(calculatePaint({ ...baseInput, canPrice: -1 })).toBeNull()
  })
})
