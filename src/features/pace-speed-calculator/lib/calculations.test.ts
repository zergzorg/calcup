import { describe, expect, it } from 'vitest'
import {
  convertPaceToSpeed,
  convertSpeedToPace,
  isValidPaceInput,
  paceInputToTotalMinutes,
  totalMinutesToPaceParts,
} from './calculations'

describe('pace speed calculations', () => {
  it('converts min/km pace to km/h and mph', () => {
    expect(convertPaceToSpeed({ minutes: 5, seconds: 0 })).toMatchObject({
      speedKmH: 12,
      speedMph: 7.46,
      paceMinPerKm: { minutes: 5, seconds: 0 },
      paceMinPerMile: { minutes: 8, seconds: 3 },
    })
  })

  it('converts km/h speed to min/km and min/mile pace', () => {
    expect(convertSpeedToPace(12)).toMatchObject({
      speedKmH: 12,
      speedMph: 7.46,
      paceMinPerKm: { minutes: 5, seconds: 0 },
      paceMinPerMile: { minutes: 8, seconds: 3 },
    })
  })

  it('keeps common treadmill pace values stable', () => {
    const result = convertPaceToSpeed({ minutes: 6, seconds: 0 })
    expect(result?.speedKmH).toBe(10)
    expect(result?.speedMph).toBe(6.21)
  })

  it('normalizes seconds when rounding reaches 60', () => {
    expect(totalMinutesToPaceParts(4.999)).toMatchObject({ minutes: 5, seconds: 0 })
  })

  it('rejects empty, zero and negative pace inputs', () => {
    expect(isValidPaceInput({ minutes: 0, seconds: 0 })).toBe(false)
    expect(isValidPaceInput({ minutes: -1, seconds: 30 })).toBe(false)
    expect(isValidPaceInput({ minutes: 5, seconds: -1 })).toBe(false)
    expect(isValidPaceInput({ minutes: 5, seconds: 60 })).toBe(false)
    expect(paceInputToTotalMinutes({ minutes: 0, seconds: 0 })).toBeNull()
  })

  it('rejects zero, negative and non-finite speed', () => {
    expect(convertSpeedToPace(0)).toBeNull()
    expect(convertSpeedToPace(-10)).toBeNull()
    expect(convertSpeedToPace(Number.NaN)).toBeNull()
    expect(convertSpeedToPace(Number.POSITIVE_INFINITY)).toBeNull()
  })
})
