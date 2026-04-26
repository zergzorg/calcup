import { describe, expect, it } from 'vitest'
import { calculateCatAge, calculateCatHumanYears } from './calculations'

describe('calculateCatHumanYears', () => {
  it('uses the common 15/24/+4 cat age approximation', () => {
    expect(calculateCatHumanYears(6)).toBe(7.5)
    expect(calculateCatHumanYears(12)).toBe(15)
    expect(calculateCatHumanYears(24)).toBe(24)
    expect(calculateCatHumanYears(60)).toBe(36)
  })

  it('rejects invalid month totals', () => {
    expect(calculateCatHumanYears(-1)).toBeNull()
    expect(calculateCatHumanYears(Number.NaN)).toBeNull()
  })
})

describe('calculateCatAge', () => {
  it('returns a full cat age result', () => {
    expect(calculateCatAge({ years: 12, months: 6 })).toEqual({
      totalMonths: 150,
      catYears: 12.5,
      humanYears: 66,
      stageKey: 'senior',
    })
  })
})
