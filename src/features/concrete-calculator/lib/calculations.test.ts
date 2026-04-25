import { describe, expect, it } from 'vitest'
import { calculateConcrete } from './calculations'

describe('concrete calculations', () => {
  it('calculates slab volume, bags and cost', () => {
    expect(calculateConcrete({
      lengthM: 4,
      widthM: 3,
      thicknessMm: 120,
      wastePercent: 5,
      bagYieldLiters: 12,
      pricePerM3: 6200,
    })).toEqual({
      area: 12,
      baseVolumeM3: 1.44,
      volumeWithWasteM3: 1.512,
      volumeLiters: 1512,
      bagsNeeded: 126,
      purchaseLiters: 1512,
      leftoverLiters: 0,
      totalCost: 9374.4,
    })
  })

  it('rounds bags up and supports zero price', () => {
    expect(calculateConcrete({
      lengthM: 2,
      widthM: 2,
      thicknessMm: 100,
      wastePercent: 10,
      bagYieldLiters: 17,
      pricePerM3: 0,
    })).toMatchObject({
      volumeWithWasteM3: 0.44,
      volumeLiters: 440,
      bagsNeeded: 26,
      purchaseLiters: 442,
      leftoverLiters: 2,
      totalCost: null,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateConcrete({
      lengthM: 0,
      widthM: 2,
      thicknessMm: 100,
      wastePercent: 10,
      bagYieldLiters: 17,
      pricePerM3: 0,
    })).toBeNull()
  })
})
