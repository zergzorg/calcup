import { describe, expect, it } from 'vitest'
import { calculateRidgeLength, calculateRoof, slopeFactorFromPitch } from './calculations'

describe('roof helpers', () => {
  it('calculates slope factor from pitch', () => {
    expect(slopeFactorFromPitch(30)).toBeCloseTo(1.1547, 4)
  })

  it('estimates ridge length by roof type', () => {
    expect(calculateRidgeLength('gable', 10, 8)).toBe(10)
    expect(calculateRidgeLength('shed', 10, 8)).toBe(10)
    expect(calculateRidgeLength('hip', 10, 8)).toBe(2)
  })
})

describe('calculateRoof', () => {
  it('calculates roof area, sheets and cost', () => {
    expect(calculateRoof({
      roofType: 'gable',
      lengthM: 10,
      widthM: 8,
      overhangMm: 500,
      pitchDegrees: 30,
      sheetLengthM: 3,
      sheetWidthM: 1.1,
      sideOverlapMm: 100,
      endOverlapMm: 200,
      wastePercent: 10,
      pricePerSheet: 1200,
    })).toEqual({
      projectedLengthM: 11,
      projectedWidthM: 9,
      projectedAreaM2: 99,
      slopeFactor: 1.155,
      slopeLengthM: 5.2,
      roofAreaM2: 114.32,
      materialAreaM2: 125.75,
      effectiveSheetAreaM2: 2.8,
      sheetsNeeded: 45,
      purchaseAreaM2: 148.5,
      leftoverAreaM2: 22.75,
      ridgeLengthM: 11,
      totalCost: 54000,
    })
  })

  it('uses full width as slope length for shed roof', () => {
    expect(calculateRoof({
      roofType: 'shed',
      lengthM: 6,
      widthM: 4,
      overhangMm: 0,
      pitchDegrees: 0,
      sheetLengthM: 2,
      sheetWidthM: 1,
      sideOverlapMm: 0,
      endOverlapMm: 0,
      wastePercent: 0,
      pricePerSheet: 0,
    })?.slopeLengthM).toBe(4)
  })

  it('returns null when overlaps consume the sheet', () => {
    expect(calculateRoof({
      roofType: 'gable',
      lengthM: 10,
      widthM: 8,
      overhangMm: 500,
      pitchDegrees: 30,
      sheetLengthM: 3,
      sheetWidthM: 1.1,
      sideOverlapMm: 1100,
      endOverlapMm: 200,
      wastePercent: 10,
      pricePerSheet: 1200,
    })).toBeNull()
  })
})
