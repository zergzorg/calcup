import { describe, expect, it } from 'vitest'
import { calculateInsulation, isPositiveInteger } from './calculations'

describe('insulation calculations', () => {
  it('calculates boards, packs, area, volume and cost', () => {
    expect(calculateInsulation({
      surfaceArea: 42,
      excludedArea: 2,
      boardLengthM: 1.2,
      boardWidthM: 0.6,
      boardThicknessMm: 50,
      boardsPerPack: 8,
      wastePercent: 10,
      packPrice: 1450,
    })).toEqual({
      grossArea: 42,
      netArea: 40,
      boardArea: 0.72,
      materialArea: 44,
      boardsNeeded: 62,
      packsNeeded: 8,
      purchaseArea: 46.08,
      leftoverArea: 2.08,
      insulationVolume: 2.2,
      purchaseVolume: 2.304,
      totalCost: 11600,
    })
  })

  it('supports zero price', () => {
    expect(calculateInsulation({
      surfaceArea: 12,
      excludedArea: 0,
      boardLengthM: 1,
      boardWidthM: 0.5,
      boardThicknessMm: 100,
      boardsPerPack: 4,
      wastePercent: 0,
      packPrice: 0,
    })).toMatchObject({
      boardsNeeded: 24,
      packsNeeded: 6,
      totalCost: null,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateInsulation({
      surfaceArea: 12,
      excludedArea: 12,
      boardLengthM: 1.2,
      boardWidthM: 0.6,
      boardThicknessMm: 50,
      boardsPerPack: 8.5,
      wastePercent: 10,
      packPrice: 1450,
    })).toBeNull()
    expect(isPositiveInteger(8.5)).toBe(false)
  })
})
