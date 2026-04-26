import { describe, expect, it } from 'vitest'
import { calculateDogAge, calculateDogHumanYears } from './calculations'

describe('calculateDogHumanYears', () => {
  it('uses faster aging during the first two dog years', () => {
    expect(calculateDogHumanYears(6, 'medium')).toBe(7.5)
    expect(calculateDogHumanYears(12, 'medium')).toBe(15)
    expect(calculateDogHumanYears(24, 'medium')).toBe(24)
  })

  it('adjusts adult years by dog size', () => {
    expect(calculateDogHumanYears(60, 'small')).toBe(36)
    expect(calculateDogHumanYears(60, 'medium')).toBe(39)
    expect(calculateDogHumanYears(60, 'large')).toBe(42)
    expect(calculateDogHumanYears(60, 'giant')).toBe(45)
  })

  it('rejects invalid month totals', () => {
    expect(calculateDogHumanYears(-1, 'small')).toBeNull()
    expect(calculateDogHumanYears(Number.NaN, 'small')).toBeNull()
  })
})

describe('calculateDogAge', () => {
  it('returns a full dog age result', () => {
    expect(calculateDogAge({ years: 8, months: 6, size: 'large' })).toEqual({
      totalMonths: 102,
      dogYears: 8.5,
      humanYears: 63,
      stageKey: 'senior',
      yearlyAgingRate: 6,
    })
  })
})
