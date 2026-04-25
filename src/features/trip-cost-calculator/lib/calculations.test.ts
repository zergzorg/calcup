import { describe, expect, it } from 'vitest'
import { calculateTripCost, isNonNegative, isPositive } from './calculations'

describe('trip cost calculations', () => {
  it('calculates round trip fuel, extras and cost per person', () => {
    expect(calculateTripCost({
      distanceKm: 320,
      consumptionPer100Km: 8.2,
      fuelPricePerLiter: 62,
      tolls: 1200,
      parking: 500,
      otherCosts: 300,
      passengers: 4,
      direction: 'roundTrip',
    })).toEqual({
      effectiveDistanceKm: 640,
      fuelLiters: 52.48,
      fuelCost: 3253.76,
      extraCosts: 2000,
      totalCost: 5253.76,
      costPerPerson: 1313.44,
    })
  })

  it('allows zero extra costs and zero fuel price', () => {
    const result = calculateTripCost({
      distanceKm: 100,
      consumptionPer100Km: 7,
      fuelPricePerLiter: 0,
      tolls: 0,
      parking: 0,
      otherCosts: 0,
      passengers: 1,
      direction: 'oneWay',
    })

    expect(result?.fuelLiters).toBe(7)
    expect(result?.totalCost).toBe(0)
    expect(result?.costPerPerson).toBe(0)
  })

  it('rejects invalid values', () => {
    expect(calculateTripCost({
      distanceKm: 0,
      consumptionPer100Km: 7,
      fuelPricePerLiter: 62,
      tolls: 0,
      parking: 0,
      otherCosts: 0,
      passengers: 1,
      direction: 'oneWay',
    })).toBeNull()
    expect(isPositive(0)).toBe(false)
    expect(isNonNegative(-1)).toBe(false)
  })
})
