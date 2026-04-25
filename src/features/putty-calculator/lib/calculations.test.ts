import { describe, expect, it } from 'vitest'
import { calculatePutty } from './calculations'

describe('putty calculations', () => {
  it('calculates mix, bags, leftovers and cost', () => {
    expect(calculatePutty({
      surfaceArea: 36,
      excludedArea: 2,
      layerThicknessMm: 2,
      consumptionKgPerM2Mm: 1.2,
      wastePercent: 10,
      bagWeightKg: 20,
      bagPrice: 620,
    })).toEqual({
      grossArea: 36,
      netArea: 34,
      mixKg: 89.8,
      bagsNeeded: 5,
      purchaseKg: 100,
      leftoverKg: 10.2,
      totalCost: 3100,
    })
  })

  it('supports zero price', () => {
    expect(calculatePutty({
      surfaceArea: 10,
      excludedArea: 0,
      layerThicknessMm: 1,
      consumptionKgPerM2Mm: 1,
      wastePercent: 0,
      bagWeightKg: 5,
      bagPrice: 0,
    })).toMatchObject({
      mixKg: 10,
      bagsNeeded: 2,
      totalCost: null,
    })
  })

  it('rejects invalid area', () => {
    expect(calculatePutty({
      surfaceArea: 10,
      excludedArea: 10,
      layerThicknessMm: 1,
      consumptionKgPerM2Mm: 1,
      wastePercent: 0,
      bagWeightKg: 5,
      bagPrice: 0,
    })).toBeNull()
  })
})
