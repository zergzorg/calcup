import { describe, expect, it } from 'vitest'
import {
  addDays,
  calculateCatPregnancy,
  diffDays,
  formatDateOnly,
  getCatPregnancyPhase,
  getCatPregnancyWindow,
  parseDateOnly,
} from './calculations'

describe('cat pregnancy date helpers', () => {
  it('parses and formats ISO dates', () => {
    const date = parseDateOnly('2026-04-26')

    expect(date).toEqual({ year: 2026, month: 4, day: 26 })
    expect(date && formatDateOnly(date)).toBe('2026-04-26')
  })

  it('rejects impossible dates', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(parseDateOnly('04/26/2026')).toBeNull()
  })

  it('adds and diffs days in UTC', () => {
    const start = parseDateOnly('2026-12-25')!
    const end = addDays(start, 10)

    expect(formatDateOnly(end)).toBe('2027-01-04')
    expect(diffDays(start, end)).toBe(10)
  })
})

describe('cat pregnancy window and phases', () => {
  it('uses the usual queening window from mating date', () => {
    expect(getCatPregnancyWindow()).toEqual({ earliest: 60, latest: 67 })
  })

  it('classifies pregnancy timeline phases', () => {
    expect(getCatPregnancyPhase(-1, 61, 68)).toBe('beforeStart')
    expect(getCatPregnancyPhase(10, 50, 57)).toBe('early')
    expect(getCatPregnancyPhase(30, 30, 37)).toBe('mid')
    expect(getCatPregnancyPhase(50, 10, 17)).toBe('late')
    expect(getCatPregnancyPhase(62, -2, 5)).toBe('queeningWindow')
    expect(getCatPregnancyPhase(68, -8, -1)).toBe('pastWindow')
  })
})

describe('calculateCatPregnancy', () => {
  it('calculates due date and queening window from mating date', () => {
    expect(calculateCatPregnancy({
      matingDate: '2026-04-01',
      todayDate: '2026-05-01',
    })).toEqual({
      matingDate: '2026-04-01',
      dueDate: '2026-06-04',
      earliestDate: '2026-05-31',
      latestDate: '2026-06-07',
      dayOfPregnancy: 30,
      daysUntilDue: 34,
      daysUntilEarliest: 30,
      daysUntilLatest: 37,
      phase: 'mid',
    })
  })

  it('marks the queening window', () => {
    expect(calculateCatPregnancy({
      matingDate: '2026-04-01',
      todayDate: '2026-06-02',
    })).toMatchObject({
      dueDate: '2026-06-04',
      earliestDate: '2026-05-31',
      latestDate: '2026-06-07',
      dayOfPregnancy: 62,
      daysUntilDue: 2,
      phase: 'queeningWindow',
    })
  })

  it('returns null for invalid dates', () => {
    expect(calculateCatPregnancy({
      matingDate: '',
      todayDate: '2026-05-01',
    })).toBeNull()
  })
})
