import { describe, expect, it } from 'vitest'
import { calculateStripFoundation, rebarWeightPerMeter } from './calculations'

describe('strip foundation calculator', () => {
  it('calculates concrete, sand, formwork and rebar estimates', () => {
    expect(calculateStripFoundation({
      totalLengthM: 40,
      widthMm: 400,
      heightMm: 800,
      sandDepthMm: 150,
      wastePercent: 10,
      rebarRuns: 4,
      rebarDiameterMm: 12,
      concretePricePerM3: 6000,
      rebarPricePerKg: 75,
    })).toEqual({
      baseConcreteVolumeM3: 12.8,
      concreteVolumeWithWasteM3: 14.08,
      sandVolumeM3: 2.64,
      formworkAreaM2: 64,
      rebarLengthM: 176,
      rebarWeightKg: 156.5,
      concreteCost: 84480,
      rebarCost: 11734.8,
      totalCost: 96214.8,
    })
  })

  it('uses approximate rebar mass from diameter', () => {
    expect(rebarWeightPerMeter(10)).toBe(0.617)
    expect(rebarWeightPerMeter(12)).toBe(0.889)
  })

  it('allows zero prices and zero sand depth', () => {
    expect(calculateStripFoundation({
      totalLengthM: 10,
      widthMm: 300,
      heightMm: 500,
      sandDepthMm: 0,
      wastePercent: 0,
      rebarRuns: 2,
      rebarDiameterMm: 10,
      concretePricePerM3: 0,
      rebarPricePerKg: 0,
    })).toMatchObject({
      sandVolumeM3: 0,
      concreteCost: null,
      rebarCost: null,
      totalCost: null,
    })
  })

  it('returns null for invalid input', () => {
    expect(calculateStripFoundation({
      totalLengthM: 0,
      widthMm: 400,
      heightMm: 800,
      sandDepthMm: 150,
      wastePercent: 10,
      rebarRuns: 4,
      rebarDiameterMm: 12,
      concretePricePerM3: 6000,
      rebarPricePerKg: 75,
    })).toBeNull()
  })
})
