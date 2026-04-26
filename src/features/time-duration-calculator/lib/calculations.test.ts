import { describe, expect, it } from 'vitest'
import { calculateTimeDuration, formatDuration, normalizeSeconds, toTotalSeconds } from './calculations'

describe('time duration calculations', () => {
  it('adds two durations and normalizes minutes and seconds', () => {
    const result = calculateTimeDuration(
      { hours: 1, minutes: 75, seconds: 90 },
      { hours: 0, minutes: 44, seconds: 30 },
      'add',
    )

    expect(result?.totalSeconds).toBe(10860)
    expect(result?.parts).toEqual({ hours: 3, minutes: 1, seconds: 0 })
    expect(result?.formatted).toBe('03:01:00')
  })

  it('subtracts durations and keeps a negative sign when needed', () => {
    const result = calculateTimeDuration(
      { hours: 1, minutes: 0, seconds: 0 },
      { hours: 1, minutes: 30, seconds: 0 },
      'subtract',
    )

    expect(result?.sign).toBe(-1)
    expect(result?.totalSeconds).toBe(-1800)
    expect(result?.parts).toEqual({ hours: 0, minutes: 30, seconds: 0 })
    expect(result?.formatted).toBe('-00:30:00')
  })

  it('handles zero durations', () => {
    const result = calculateTimeDuration(
      { hours: 0, minutes: 0, seconds: 0 },
      { hours: 0, minutes: 0, seconds: 0 },
      'add',
    )

    expect(result?.totalSeconds).toBe(0)
    expect(result?.formatted).toBe('00:00:00')
  })

  it('rejects negative or fractional input parts', () => {
    expect(toTotalSeconds({ hours: -1, minutes: 0, seconds: 0 })).toBeNull()
    expect(toTotalSeconds({ hours: 0, minutes: 1.5, seconds: 0 })).toBeNull()
    expect(calculateTimeDuration({ hours: 0, minutes: 0, seconds: 0 }, { hours: 0, minutes: -1, seconds: 0 }, 'add')).toBeNull()
  })

  it('formats arbitrary signed seconds', () => {
    expect(normalizeSeconds(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 })
    expect(formatDuration(-3661)).toBe('-01:01:01')
  })
})
