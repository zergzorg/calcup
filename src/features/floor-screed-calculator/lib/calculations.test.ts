import { describe, expect, it } from 'vitest'
import { calculateFloorScreed, isNonNegative, isPositive } from './calculations'

describe('floor screed calculations', () => {
  it('calculates volume, dry mix, bags and cost', () => {
    expect(calculateFloorScreed({
      roomLength: 4,
      roomWidth: 3,
      excludedArea: 0,
      thicknessMm: 50,
      consumptionKgPerM2Mm: 1.8,
      wastePercent: 10,
      bagWeight: 25,
      bagPrice: 320,
    })).toEqual({
      grossArea: 12,
      netArea: 12,
      volumeM3: 0.6,
      dryMixKg: 1188,
      bagsNeeded: 48,
      purchaseKg: 1200,
      leftoverKg: 12,
      totalCost: 15360,
    })
  })

  it('allows zero waste and hidden cost', () => {
    const result = calculateFloorScreed({
      roomLength: 2,
      roomWidth: 2,
      excludedArea: 0,
      thicknessMm: 25,
      consumptionKgPerM2Mm: 1.8,
      wastePercent: 0,
      bagWeight: 20,
      bagPrice: 0,
    })

    expect(result?.volumeM3).toBe(0.1)
    expect(result?.dryMixKg).toBe(180)
    expect(result?.bagsNeeded).toBe(9)
    expect(result?.totalCost).toBeNull()
  })

  it('rejects invalid inputs and impossible exclusions', () => {
    expect(calculateFloorScreed({
      roomLength: 4,
      roomWidth: 3,
      excludedArea: 12,
      thicknessMm: 50,
      consumptionKgPerM2Mm: 1.8,
      wastePercent: 10,
      bagWeight: 25,
      bagPrice: 320,
    })).toBeNull()
    expect(isPositive(0)).toBe(false)
    expect(isNonNegative(-1)).toBe(false)
  })
})
