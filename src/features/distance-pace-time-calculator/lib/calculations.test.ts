import { describe, expect, it } from 'vitest'
import {
  calculateDistanceByTimeAndPace,
  calculatePaceByDistanceAndTime,
  calculateTimeByDistanceAndPace,
  isValidPaceInput,
  isValidTimeInput,
  secondsToPaceParts,
  secondsToTimeParts,
} from './calculations'

describe('distance pace time calculations', () => {
  it('calculates finish time from distance and pace', () => {
    expect(calculateTimeByDistanceAndPace(10, { minutes: 5, seconds: 0 })).toMatchObject({
      distanceKm: 10,
      time: { hours: 0, minutes: 50, seconds: 0 },
      pace: { minutes: 5, seconds: 0 },
      speedKmH: 12,
    })
  })

  it('calculates pace from distance and time', () => {
    expect(calculatePaceByDistanceAndTime(10, { hours: 0, minutes: 50, seconds: 0 })).toMatchObject({
      distanceKm: 10,
      time: { hours: 0, minutes: 50, seconds: 0 },
      pace: { minutes: 5, seconds: 0 },
      speedKmH: 12,
    })
  })

  it('calculates distance from time and pace', () => {
    expect(calculateDistanceByTimeAndPace(
      { hours: 1, minutes: 0, seconds: 0 },
      { minutes: 6, seconds: 0 },
    )).toMatchObject({
      distanceKm: 10,
      time: { hours: 1, minutes: 0, seconds: 0 },
      pace: { minutes: 6, seconds: 0 },
      speedKmH: 10,
    })
  })

  it('rounds half marathon time correctly', () => {
    expect(calculateTimeByDistanceAndPace(21.1, { minutes: 5, seconds: 0 })?.time).toMatchObject({
      hours: 1,
      minutes: 45,
      seconds: 30,
    })
  })

  it('converts raw seconds to display parts', () => {
    expect(secondsToTimeParts(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1, totalSeconds: 3661 })
    expect(secondsToPaceParts(301)).toEqual({ minutes: 5, seconds: 1, totalSeconds: 301 })
  })

  it('rejects invalid time and pace values', () => {
    expect(isValidTimeInput({ hours: 0, minutes: 0, seconds: 0 })).toBe(false)
    expect(isValidTimeInput({ hours: 0, minutes: 60, seconds: 0 })).toBe(false)
    expect(isValidPaceInput({ minutes: 0, seconds: 0 })).toBe(false)
    expect(isValidPaceInput({ minutes: 5, seconds: 60 })).toBe(false)
    expect(calculateTimeByDistanceAndPace(0, { minutes: 5, seconds: 0 })).toBeNull()
    expect(calculatePaceByDistanceAndTime(10, { hours: 0, minutes: 0, seconds: 0 })).toBeNull()
    expect(calculateDistanceByTimeAndPace(
      { hours: 0, minutes: 50, seconds: 0 },
      { minutes: 0, seconds: 0 },
    )).toBeNull()
  })
})
