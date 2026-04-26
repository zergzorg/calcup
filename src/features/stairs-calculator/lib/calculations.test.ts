import { describe, expect, it } from 'vitest'
import { calculateStairs, classifyComfort } from './calculations'

describe('classifyComfort', () => {
  it('classifies common step formula ranges', () => {
    expect(classifyComfort(59.9)).toBe('low')
    expect(classifyComfort(62)).toBe('comfortable')
    expect(classifyComfort(64.1)).toBe('steep')
  })
})

describe('calculateStairs', () => {
  it('calculates stair geometry and tread purchase', () => {
    expect(calculateStairs({
      totalRiseCm: 280,
      targetRiserCm: 17,
      treadDepthCm: 28,
      stairWidthM: 0.9,
      wastePercent: 10,
      pricePerTread: 1200,
    })).toEqual({
      risersCount: 17,
      treadsCount: 16,
      actualRiserCm: 16.5,
      treadDepthCm: 28,
      totalRunCm: 448,
      stairAngleDegrees: 32,
      stringerLengthM: 5.28,
      treadAreaM2: 4.03,
      treadAreaWithWasteM2: 4.44,
      purchaseTreads: 18,
      comfortStepCm: 60.9,
      comfort: 'comfortable',
      totalCost: 21600,
    })
  })

  it('omits cost when tread price is zero', () => {
    expect(calculateStairs({
      totalRiseCm: 300,
      targetRiserCm: 18,
      treadDepthCm: 27,
      stairWidthM: 1,
      wastePercent: 0,
      pricePerTread: 0,
    })?.totalCost).toBeNull()
  })

  it('returns null for invalid input', () => {
    expect(calculateStairs({
      totalRiseCm: 0,
      targetRiserCm: 17,
      treadDepthCm: 28,
      stairWidthM: 0.9,
      wastePercent: 10,
      pricePerTread: 1200,
    })).toBeNull()
  })
})
