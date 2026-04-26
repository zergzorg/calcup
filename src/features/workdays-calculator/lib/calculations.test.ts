import { describe, expect, it } from 'vitest'
import { calculateWorkdays, parseDateOnly } from './calculations'

describe('workdays calculations', () => {
  it('counts weekdays between two dates including the end date by default', () => {
    const result = calculateWorkdays('2026-04-20', '2026-04-26')

    expect(result).toEqual({
      workdays: 5,
      weekendDays: 2,
      calendarDays: 7,
      fullWeeks: 1,
      direction: 'future',
    })
  })

  it('can exclude the end date', () => {
    const result = calculateWorkdays('2026-04-20', '2026-04-26', { includeEndDate: false })

    expect(result?.calendarDays).toBe(6)
    expect(result?.workdays).toBe(5)
    expect(result?.weekendDays).toBe(1)
  })

  it('supports reversed dates and reports direction', () => {
    const result = calculateWorkdays('2026-04-26', '2026-04-20')

    expect(result?.direction).toBe('past')
    expect(result?.workdays).toBe(5)
  })

  it('returns zero workdays for a weekend-only single date', () => {
    const result = calculateWorkdays('2026-04-26', '2026-04-26')

    expect(result?.direction).toBe('same')
    expect(result?.calendarDays).toBe(1)
    expect(result?.workdays).toBe(0)
    expect(result?.weekendDays).toBe(1)
  })

  it('rejects invalid dates', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(calculateWorkdays('2026-02-30', '2026-03-01')).toBeNull()
  })
})
