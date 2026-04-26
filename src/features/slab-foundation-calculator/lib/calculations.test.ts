import { describe, expect, it } from 'vitest'
import { calculateSlabFoundation, countBarsAcross, rebarWeightPerMeter } from './calculations'

describe('rebar helpers', () => {
  it('calculates rebar weight per meter', () => {
    expect(rebarWeightPerMeter(12)).toBe(0.889)
  })

  it('counts bars across span by spacing', () => {
    expect(countBarsAcross(6, 200)).toBe(31)
    expect(countBarsAcross(4, 200)).toBe(21)
  })
})

describe('calculateSlabFoundation', () => {
  it('calculates concrete, base layers and rebar mesh', () => {
    expect(calculateSlabFoundation({
      lengthM: 6,
      widthM: 4,
      thicknessMm: 200,
      sandDepthMm: 150,
      gravelDepthMm: 100,
      rebarSpacingMm: 200,
      rebarDiameterMm: 12,
      rebarLayers: 2,
      wastePercent: 10,
      concretePricePerM3: 6000,
      rebarPricePerKg: 70,
    })).toEqual({
      areaM2: 24,
      baseConcreteVolumeM3: 4.8,
      concreteVolumeWithWasteM3: 5.28,
      sandVolumeM3: 3.96,
      gravelVolumeM3: 2.64,
      longitudinalBars: 21,
      transverseBars: 31,
      barsPerLayer: 52,
      totalBarsInGrid: 104,
      rebarLengthM: 550,
      rebarWeightKg: 489,
      concreteCost: 31680,
      rebarCost: 34226.5,
      totalCost: 65906.5,
    })
  })

  it('omits cost when prices are zero', () => {
    expect(calculateSlabFoundation({
      lengthM: 6,
      widthM: 4,
      thicknessMm: 200,
      sandDepthMm: 0,
      gravelDepthMm: 0,
      rebarSpacingMm: 200,
      rebarDiameterMm: 12,
      rebarLayers: 1,
      wastePercent: 0,
      concretePricePerM3: 0,
      rebarPricePerKg: 0,
    })?.totalCost).toBeNull()
  })

  it('returns null for invalid input', () => {
    expect(calculateSlabFoundation({
      lengthM: 0,
      widthM: 4,
      thicknessMm: 200,
      sandDepthMm: 150,
      gravelDepthMm: 100,
      rebarSpacingMm: 200,
      rebarDiameterMm: 12,
      rebarLayers: 2,
      wastePercent: 10,
      concretePricePerM3: 6000,
      rebarPricePerKg: 70,
    })).toBeNull()
  })
})
