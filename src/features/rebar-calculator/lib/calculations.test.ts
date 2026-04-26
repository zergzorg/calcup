import { describe, expect, it } from 'vitest'
import { calculateRebar, countBarsAcross, rebarWeightPerMeter } from './calculations'

describe('rebar calculations', () => {
  it('calculates weight per meter from steel density and diameter', () => {
    expect(rebarWeightPerMeter(10)).toBe(0.617)
    expect(rebarWeightPerMeter(12)).toBe(0.888)
    expect(rebarWeightPerMeter(16)).toBe(1.578)
  })

  it('counts bars across a span using edge lines', () => {
    expect(countBarsAcross(4, 200)).toBe(21)
    expect(countBarsAcross(4.1, 200)).toBe(21)
    expect(countBarsAcross(4.2, 200)).toBe(22)
  })

  it('calculates rectangular mesh length, purchase bars, weight and cost', () => {
    expect(calculateRebar({
      lengthM: 6,
      widthM: 4,
      spacingMm: 200,
      layers: 1,
      diameterMm: 12,
      barLengthM: 6,
      wastePercent: 10,
      pricePerKg: 65,
    })).toEqual({
      longitudinalBars: 21,
      transverseBars: 31,
      barsPerLayer: 52,
      totalBarsInGrid: 52,
      baseLengthM: 250,
      lengthWithWasteM: 275,
      purchaseBars: 46,
      purchaseLengthM: 276,
      weightPerMeterKg: 0.888,
      totalWeightKg: 245.1,
      totalCost: 15930.72,
    })
  })

  it('supports two layers and zero price', () => {
    expect(calculateRebar({
      lengthM: 3,
      widthM: 2,
      spacingMm: 250,
      layers: 2,
      diameterMm: 10,
      barLengthM: 6,
      wastePercent: 5,
      pricePerKg: 0,
    })).toMatchObject({
      longitudinalBars: 9,
      transverseBars: 13,
      totalBarsInGrid: 44,
      totalCost: null,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateRebar({
      lengthM: 0,
      widthM: 4,
      spacingMm: 200,
      layers: 1,
      diameterMm: 12,
      barLengthM: 6,
      wastePercent: 10,
      pricePerKg: 65,
    })).toBeNull()

    expect(calculateRebar({
      lengthM: 6,
      widthM: 4,
      spacingMm: 200,
      layers: 1.5,
      diameterMm: 12,
      barLengthM: 6,
      wastePercent: 10,
      pricePerKg: 65,
    })).toBeNull()
  })
})
