import { describe, expect, it } from 'vitest'
import { buildSplitPoints, calculateRaceSplits, secondsToParts, timeToSeconds } from './calculations'

describe('race split calculations', () => {
  it('calculates pace, speed and kilometer splits', () => {
    expect(calculateRaceSplits({
      distanceKm: 10,
      hours: 0,
      minutes: 50,
      seconds: 0,
      splitDistanceKm: 2,
    })).toEqual({
      distanceKm: 10,
      totalSeconds: 3000,
      paceSecondsPerKm: 300,
      speedKmH: 12,
      splits: [
        { distanceKm: 2, cumulativeSeconds: 600 },
        { distanceKm: 4, cumulativeSeconds: 1200 },
        { distanceKm: 6, cumulativeSeconds: 1800 },
        { distanceKm: 8, cumulativeSeconds: 2400 },
        { distanceKm: 10, cumulativeSeconds: 3000 },
      ],
    })
  })

  it('keeps finish split when distance is not divisible by split distance', () => {
    expect(buildSplitPoints(5, 2, 360)).toEqual([
      { distanceKm: 2, cumulativeSeconds: 720 },
      { distanceKm: 4, cumulativeSeconds: 1440 },
      { distanceKm: 5, cumulativeSeconds: 1800 },
    ])
  })

  it('validates time and split inputs', () => {
    expect(timeToSeconds(1, 2, 3)).toBe(3723)
    expect(secondsToParts(3723)).toEqual({ hours: 1, minutes: 2, seconds: 3 })
    expect(calculateRaceSplits({ distanceKm: 10, hours: 0, minutes: 0, seconds: 0, splitDistanceKm: 1 })).toBeNull()
    expect(calculateRaceSplits({ distanceKm: 10, hours: 0, minutes: 45, seconds: 0, splitDistanceKm: 12 })).toBeNull()
  })
})
