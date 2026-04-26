import { describe, expect, it } from 'vitest'
import { calculateAge, formatDateOnly, parseDateOnly } from './calculations'

describe('age calculations', () => {
  it('calculates years, months, days and totals', () => {
    const result = calculateAge('1990-01-15', '2026-04-26')

    expect(result).not.toBeNull()
    expect(result?.age).toEqual({ years: 36, months: 3, days: 11 })
    expect(result?.totalMonths).toBe(435)
    expect(result?.totalWeeks).toBe(Math.floor(result!.totalDays / 7))
    expect(formatDateOnly(result!.nextBirthday)).toBe('2027-01-15')
    expect(result?.nextBirthdayAge).toBe(37)
  })

  it('returns current birthday when target date is the birthday', () => {
    const result = calculateAge('2000-04-26', '2026-04-26')

    expect(result?.age).toEqual({ years: 26, months: 0, days: 0 })
    expect(result?.daysUntilBirthday).toBe(0)
    expect(result?.nextBirthdayAge).toBe(26)
  })

  it('uses February 28 for leap-day birthdays in non-leap years', () => {
    const result = calculateAge('2004-02-29', '2025-02-27')

    expect(result?.age).toEqual({ years: 20, months: 11, days: 29 })
    expect(formatDateOnly(result!.nextBirthday)).toBe('2025-02-28')
    expect(result?.daysUntilBirthday).toBe(1)
    expect(result?.nextBirthdayAge).toBe(21)
  })

  it('rejects invalid dates and target dates before birth', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(calculateAge('2026-04-26', '2025-04-26')).toBeNull()
  })
})
