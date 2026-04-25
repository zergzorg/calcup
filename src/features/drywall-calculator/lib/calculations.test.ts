import { describe, expect, it } from 'vitest'
import { calculateDrywall, isPositiveInteger } from './calculations'

describe('drywall calculations', () => {
  it('calculates sheets, profiles, screws and cost', () => {
    expect(calculateDrywall({
      wallLength: 5,
      wallHeight: 2.8,
      openingsArea: 1.8,
      sheetWidth: 1.2,
      sheetHeight: 2.5,
      layers: 1,
      wastePercent: 10,
      studSpacingMm: 600,
      screwsPerSheet: 35,
      sheetPrice: 420,
    })).toEqual({
      grossArea: 14,
      netArea: 12.2,
      materialArea: 13.42,
      sheetArea: 3,
      sheetsNeeded: 5,
      purchaseArea: 15,
      leftoverArea: 1.58,
      guideProfileM: 10,
      studProfileM: 25.2,
      studsCount: 9,
      screwsNeeded: 175,
      totalCost: 2100,
    })
  })

  it('supports two-layer sheathing and free price', () => {
    expect(calculateDrywall({
      wallLength: 4,
      wallHeight: 3,
      openingsArea: 0,
      sheetWidth: 1.2,
      sheetHeight: 3,
      layers: 2,
      wastePercent: 0,
      studSpacingMm: 400,
      screwsPerSheet: 45,
      sheetPrice: 0,
    })).toMatchObject({
      materialArea: 24,
      sheetsNeeded: 7,
      screwsNeeded: 315,
      totalCost: null,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateDrywall({
      wallLength: 2,
      wallHeight: 2,
      openingsArea: 4,
      sheetWidth: 1.2,
      sheetHeight: 2.5,
      layers: 1,
      wastePercent: 10,
      studSpacingMm: 600,
      screwsPerSheet: 35,
      sheetPrice: 420,
    })).toBeNull()
    expect(isPositiveInteger(1.5)).toBe(false)
  })
})
