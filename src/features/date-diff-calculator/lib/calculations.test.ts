import { describe, expect, it } from 'vitest'
import {
  calculateDayDifference,
  compareDateOnly,
  isValidDateOnly,
  parseDateOnly,
} from './calculations'

describe('parseDateOnly', () => {
  it('parses a valid date', () => {
    expect(parseDateOnly('2026-01-15')).toEqual({ year: 2026, month: 1, day: 15 })
  })

  it('rejects empty string', () => {
    expect(parseDateOnly('')).toBeNull()
  })

  it('rejects wrong format', () => {
    expect(parseDateOnly('abc')).toBeNull()
    expect(parseDateOnly('2026/01/01')).toBeNull()
    expect(parseDateOnly('01-01-2026')).toBeNull()
  })

  it('rejects month 13', () => {
    expect(parseDateOnly('2026-13-01')).toBeNull()
  })

  it('rejects Feb 30', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
  })

  it('rejects Apr 31', () => {
    expect(parseDateOnly('2026-04-31')).toBeNull()
  })

  it('accepts Feb 29 in a leap year', () => {
    expect(parseDateOnly('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 })
  })

  it('rejects Feb 29 in a non-leap year', () => {
    expect(parseDateOnly('2023-02-29')).toBeNull()
  })
})

describe('isValidDateOnly', () => {
  it('returns true for a valid date string', () => {
    expect(isValidDateOnly('2026-04-25')).toBe(true)
  })

  it('returns false for an invalid date string', () => {
    expect(isValidDateOnly('2026-02-30')).toBe(false)
    expect(isValidDateOnly('')).toBe(false)
  })
})

describe('compareDateOnly', () => {
  it('returns negative when a is earlier', () => {
    expect(compareDateOnly({ year: 2026, month: 1, day: 1 }, { year: 2026, month: 1, day: 2 })).toBeLessThan(0)
  })

  it('returns positive when a is later', () => {
    expect(compareDateOnly({ year: 2026, month: 2, day: 1 }, { year: 2026, month: 1, day: 1 })).toBeGreaterThan(0)
  })

  it('returns zero for equal dates', () => {
    expect(compareDateOnly({ year: 2026, month: 6, day: 15 }, { year: 2026, month: 6, day: 15 })).toBe(0)
  })
})

describe('calculateDayDifference', () => {
  it('2026-01-01 → 2026-01-02 = 1 day', () => {
    const r = calculateDayDifference('2026-01-01', '2026-01-02')
    expect(r?.days).toBe(1)
    expect(r?.direction).toBe('future')
  })

  it('same date = 0 days', () => {
    const r = calculateDayDifference('2026-01-01', '2026-01-01')
    expect(r?.days).toBe(0)
    expect(r?.direction).toBe('same')
  })

  it('includeEndDate: same date = 1 day', () => {
    const r = calculateDayDifference('2026-01-01', '2026-01-01', { includeEndDate: true })
    expect(r?.days).toBe(1)
  })

  it('includeEndDate: consecutive dates = 2 days', () => {
    const r = calculateDayDifference('2026-01-01', '2026-01-02', { includeEndDate: true })
    expect(r?.days).toBe(2)
  })

  it('reverse order gives direction past with correct abs days', () => {
    const r = calculateDayDifference('2026-01-02', '2026-01-01')
    expect(r?.days).toBe(1)
    expect(r?.direction).toBe('past')
  })

  it('leap year: 2024-02-28 → 2024-03-01 = 2 days', () => {
    const r = calculateDayDifference('2024-02-28', '2024-03-01')
    expect(r?.days).toBe(2)
  })

  it('non-leap year: 2023-02-28 → 2023-03-01 = 1 day', () => {
    const r = calculateDayDifference('2023-02-28', '2023-03-01')
    expect(r?.days).toBe(1)
  })

  it('new year transition: 2025-12-31 → 2026-01-01 = 1 day', () => {
    const r = calculateDayDifference('2025-12-31', '2026-01-01')
    expect(r?.days).toBe(1)
  })

  it('returns null for invalid start date', () => {
    expect(calculateDayDifference('bad', '2026-01-01')).toBeNull()
    expect(calculateDayDifference('', '2026-01-01')).toBeNull()
    expect(calculateDayDifference('2026-13-01', '2026-01-01')).toBeNull()
    expect(calculateDayDifference('2026-02-30', '2026-01-01')).toBeNull()
  })

  it('returns null for invalid end date', () => {
    expect(calculateDayDifference('2026-01-01', 'bad')).toBeNull()
    expect(calculateDayDifference('2026-01-01', '')).toBeNull()
  })

  it('timezone/DST: UTC-based calc gives same result regardless of locale', () => {
    // 365 days in a non-leap year
    const r = calculateDayDifference('2023-01-01', '2024-01-01')
    expect(r?.days).toBe(365)
    // 366 days in a leap year
    const r2 = calculateDayDifference('2024-01-01', '2025-01-01')
    expect(r2?.days).toBe(366)
  })

  describe('breakdown', () => {
    it('1 year, 2 months, 4 days breakdown', () => {
      const r = calculateDayDifference('2026-01-01', '2027-03-05')
      expect(r?.breakdown).toEqual({ years: 1, months: 2, days: 4 })
    })

    it('0 days gives zero breakdown', () => {
      const r = calculateDayDifference('2026-06-15', '2026-06-15')
      expect(r?.breakdown).toEqual({ years: 0, months: 0, days: 0 })
    })

    it('31 days = 1 month 0 days (January)', () => {
      const r = calculateDayDifference('2026-01-01', '2026-02-01')
      expect(r?.breakdown).toEqual({ years: 0, months: 1, days: 0 })
    })

    it('reverse order uses earlier→later for breakdown', () => {
      const r = calculateDayDifference('2027-03-05', '2026-01-01')
      expect(r?.breakdown).toEqual({ years: 1, months: 2, days: 4 })
      expect(r?.direction).toBe('past')
    })
  })
})
