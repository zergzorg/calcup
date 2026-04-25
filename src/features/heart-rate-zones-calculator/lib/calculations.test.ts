import { describe, expect, it } from 'vitest'
import { calculateHeartRateZones, estimateMaxHeartRate, isValidHeartRate } from './calculations'

describe('heart rate zone calculations', () => {
  it('estimates maximum heart rate from age', () => {
    expect(estimateMaxHeartRate(40)).toBe(180)
  })

  it('calculates zones from percentage of max heart rate', () => {
    const result = calculateHeartRateZones({ age: 40, method: 'max' })

    expect(result?.maxHeartRate).toBe(180)
    expect(result?.zones[0]).toMatchObject({ key: 'z1', minBpm: 90, maxBpm: 108 })
    expect(result?.zones[4]).toMatchObject({ key: 'z5', minBpm: 162, maxBpm: 180 })
  })

  it('calculates Karvonen zones from heart rate reserve', () => {
    const result = calculateHeartRateZones({ age: 40, maxHeartRate: 190, restingHeartRate: 60, method: 'reserve' })

    expect(result?.zones[0]).toMatchObject({ minBpm: 125, maxBpm: 138 })
    expect(result?.zones[4]).toMatchObject({ minBpm: 177, maxBpm: 190 })
  })

  it('uses a custom max heart rate when provided', () => {
    expect(calculateHeartRateZones({ age: 40, maxHeartRate: 200, method: 'max' })?.maxHeartRate).toBe(200)
  })

  it('rejects unrealistic values', () => {
    expect(isValidHeartRate(0)).toBe(false)
    expect(estimateMaxHeartRate(5)).toBeNull()
    expect(calculateHeartRateZones({ age: 40, maxHeartRate: 150, restingHeartRate: 160, method: 'reserve' })).toBeNull()
  })
})
