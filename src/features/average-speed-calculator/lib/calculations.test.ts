import { describe, expect, it } from 'vitest'
import { calculateAverageSpeed, isNonNegative, isPositive } from './calculations'

describe('average speed calculations', () => {
  it('calculates speed from distance and duration', () => {
    expect(calculateAverageSpeed({
      distanceKm: 120,
      hours: 1,
      minutes: 30,
    })).toEqual({
      totalMinutes: 90,
      speedKmH: 80,
      speedMph: 49.71,
      speedMs: 22.22,
      paceSecondsPerKm: 45,
    })
  })

  it('supports minute-only trips', () => {
    expect(calculateAverageSpeed({
      distanceKm: 10,
      hours: 0,
      minutes: 25,
    })).toEqual({
      totalMinutes: 25,
      speedKmH: 24,
      speedMph: 14.91,
      speedMs: 6.67,
      paceSecondsPerKm: 150,
    })
  })

  it('rejects invalid distance or zero duration', () => {
    expect(calculateAverageSpeed({ distanceKm: 0, hours: 1, minutes: 0 })).toBeNull()
    expect(calculateAverageSpeed({ distanceKm: 20, hours: 0, minutes: 0 })).toBeNull()
    expect(isPositive(-1)).toBe(false)
    expect(isNonNegative(0)).toBe(true)
  })
})
