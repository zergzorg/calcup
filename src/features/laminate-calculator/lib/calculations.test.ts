import { describe, expect, it } from 'vitest'
import { calculateLaminate, isNonNegative, isPositive } from './calculations'

describe('laminate calculations', () => {
  it('calculates packs, purchase area and cost with waste', () => {
    expect(calculateLaminate({
      roomLength: 5,
      roomWidth: 4,
      excludedArea: 1.2,
      wastePercent: 10,
      packCoverage: 2.131,
      packPrice: 1250,
    })).toEqual({
      grossArea: 20,
      netArea: 18.8,
      materialArea: 20.68,
      packsNeeded: 10,
      purchaseArea: 21.31,
      leftoverArea: 0.63,
      totalCost: 12500,
    })
  })

  it('allows zero exclusions, waste and hidden cost', () => {
    const result = calculateLaminate({
      roomLength: 3,
      roomWidth: 3,
      excludedArea: 0,
      wastePercent: 0,
      packCoverage: 2,
      packPrice: 0,
    })

    expect(result?.netArea).toBe(9)
    expect(result?.packsNeeded).toBe(5)
    expect(result?.totalCost).toBeNull()
  })

  it('rejects invalid dimensions and impossible exclusions', () => {
    expect(calculateLaminate({
      roomLength: 3,
      roomWidth: 3,
      excludedArea: 9,
      wastePercent: 10,
      packCoverage: 2,
      packPrice: 1200,
    })).toBeNull()
    expect(isPositive(0)).toBe(false)
    expect(isNonNegative(-1)).toBe(false)
  })
})
