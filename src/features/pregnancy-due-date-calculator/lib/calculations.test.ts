import { describe, expect, it } from 'vitest'
import {
  addDays,
  calculatePregnancyDueDate,
  diffDays,
  formatDateOnly,
  getTrimester,
  parseDateOnly,
} from './calculations'

describe('pregnancy due date calculations', () => {
  it('parses and formats date-only values through UTC', () => {
    const date = parseDateOnly('2026-01-31')

    expect(date).toEqual({ year: 2026, month: 1, day: 31 })
    expect(formatDateOnly(addDays(date!, 1))).toBe('2026-02-01')
    expect(diffDays(date!, parseDateOnly('2026-02-10')!)).toBe(10)
  })

  it('rejects invalid date-only values', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(parseDateOnly('26-02-01')).toBeNull()
    expect(parseDateOnly('')).toBeNull()
  })

  it('calculates due date and gestational age from last menstrual period', () => {
    expect(calculatePregnancyDueDate({
      mode: 'lmp',
      lmpDate: '2026-01-01',
      conceptionDate: '',
      todayDate: '2026-04-26',
    })).toEqual({
      mode: 'lmp',
      dueDate: '2026-10-08',
      pregnancyStartDate: '2026-01-01',
      gestationalAgeTotalDays: 115,
      gestationalWeeks: 16,
      gestationalDays: 3,
      daysUntilDue: 165,
      trimester: 'second',
      status: 'inProgress',
    })
  })

  it('calculates due date from conception date', () => {
    expect(calculatePregnancyDueDate({
      mode: 'conception',
      lmpDate: '',
      conceptionDate: '2026-01-15',
      todayDate: '2026-04-26',
    })).toMatchObject({
      mode: 'conception',
      dueDate: '2026-10-08',
      pregnancyStartDate: '2026-01-01',
      gestationalAgeTotalDays: 115,
      gestationalWeeks: 16,
      gestationalDays: 3,
      trimester: 'second',
    })
  })

  it('classifies trimester boundaries', () => {
    expect(getTrimester(13 * 7 + 6)).toBe('first')
    expect(getTrimester(14 * 7)).toBe('second')
    expect(getTrimester(27 * 7 + 6)).toBe('second')
    expect(getTrimester(28 * 7)).toBe('third')
  })

  it('marks dates before start, due today and past due', () => {
    expect(calculatePregnancyDueDate({
      mode: 'lmp',
      lmpDate: '2026-05-01',
      conceptionDate: '',
      todayDate: '2026-04-26',
    })?.status).toBe('beforeStart')

    expect(calculatePregnancyDueDate({
      mode: 'lmp',
      lmpDate: '2026-01-01',
      conceptionDate: '',
      todayDate: '2026-10-08',
    })?.status).toBe('dueToday')

    expect(calculatePregnancyDueDate({
      mode: 'lmp',
      lmpDate: '2026-01-01',
      conceptionDate: '',
      todayDate: '2026-10-09',
    })?.status).toBe('pastDue')
  })

  it('returns null for invalid calculation input', () => {
    expect(calculatePregnancyDueDate({
      mode: 'lmp',
      lmpDate: 'not-a-date',
      conceptionDate: '',
      todayDate: '2026-04-26',
    })).toBeNull()

    expect(calculatePregnancyDueDate({
      mode: 'conception',
      lmpDate: '',
      conceptionDate: '2026-01-15',
      todayDate: 'bad',
    })).toBeNull()
  })
})
