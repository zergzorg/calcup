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

  it('calculates custom age milestones by days, weeks and months', () => {
    const daysMilestone = calculateAge('2000-01-01', '2026-04-26', { value: 2000, unit: 'days' })
    const weeksMilestone = calculateAge('2000-01-01', '2026-04-26', { value: 5000, unit: 'weeks' })
    const monthsMilestone = calculateAge('2000-01-31', '2026-04-26', { value: 1500, unit: 'months' })

    expect(formatDateOnly(daysMilestone!.milestone!.date)).toBe('2005-06-23')
    expect(daysMilestone!.milestone!.isPast).toBe(true)

    expect(formatDateOnly(weeksMilestone!.milestone!.date)).toBe('2095-10-29')
    expect(weeksMilestone!.milestone!.isPast).toBe(false)

    expect(formatDateOnly(monthsMilestone!.milestone!.date)).toBe('2125-01-31')
  })

  it('suggests upcoming rounded milestones from the target date', () => {
    const result = calculateAge('2000-01-01', '2026-04-26')

    expect(result?.upcomingMilestones.length).toBe(4)
    expect(result!.upcomingMilestones.map(item => item.daysUntil)).toEqual(
      [...result!.upcomingMilestones.map(item => item.daysUntil)].sort((a, b) => a - b),
    )
  })

  it('rejects invalid dates and target dates before birth', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(calculateAge('2026-04-26', '2025-04-26')).toBeNull()
  })
})
