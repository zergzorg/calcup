import { describe, expect, it } from 'vitest'
import { calculateFuelPrice, isPositive } from './calculations'

describe('fuel price calculations', () => {
  it('calculates liters, distance and cost per 100 km', () => {
    expect(calculateFuelPrice({
      budget: 3000,
      pricePerLiter: 62,
      consumptionPer100Km: 8.2,
    })).toEqual({
      liters: 48.39,
      distanceKm: 590.1,
      costPer100Km: 508.4,
    })
  })

  it('handles exact division', () => {
    expect(calculateFuelPrice({
      budget: 1000,
      pricePerLiter: 50,
      consumptionPer100Km: 10,
    })).toEqual({
      liters: 20,
      distanceKm: 200,
      costPer100Km: 500,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateFuelPrice({
      budget: 0,
      pricePerLiter: 50,
      consumptionPer100Km: 10,
    })).toBeNull()
    expect(isPositive(-1)).toBe(false)
  })
})
