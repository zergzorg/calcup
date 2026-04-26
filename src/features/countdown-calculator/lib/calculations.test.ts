import { describe, expect, it } from 'vitest'
import { calculateCountdown, parseDateOnly } from './calculations'

describe('countdown calculations', () => {
  it('counts days to a future target date', () => {
    const result = calculateCountdown('2026-04-26', '2026-05-01')

    expect(result).toEqual({
      days: 5,
      calendarDays: 5,
      fullWeeks: 0,
      remainingDays: 5,
      direction: 'future',
    })
  })

  it('can include the start date for planning-style counts', () => {
    const result = calculateCountdown('2026-04-26', '2026-05-10', { includeStartDate: true })

    expect(result?.days).toBe(14)
    expect(result?.calendarDays).toBe(15)
    expect(result?.fullWeeks).toBe(2)
    expect(result?.remainingDays).toBe(1)
  })

  it('reports past targets', () => {
    const result = calculateCountdown('2026-04-26', '2026-04-20')

    expect(result?.days).toBe(6)
    expect(result?.direction).toBe('past')
  })

  it('handles current target date', () => {
    const result = calculateCountdown('2026-04-26', '2026-04-26', { includeStartDate: true })

    expect(result?.days).toBe(0)
    expect(result?.calendarDays).toBe(0)
    expect(result?.direction).toBe('today')
  })

  it('rejects invalid dates', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(calculateCountdown('2026-04-26', 'bad-date')).toBeNull()
  })
})
