import { describe, expect, it } from 'vitest'
import {
  calculateAdjustedHourlyRate,
  calculateProjectPrice,
  getComplexityMultiplier,
  getUrgencyMultiplier,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from './calculations'

describe('project price', () => {
  it('base 1000, 10 hours, simple/normal gives 10000', () => {
    const result = calculateProjectPrice({
      hourlyRate: 1000,
      projectHours: 10,
      complexityLevel: 'simple',
      urgencyLevel: 'normal',
      expenseAmount: 0,
      taxPercent: 0,
    })
    expect(result?.laborCost).toBe(10_000)
    expect(result?.totalProjectPrice).toBe(10_000)
  })

  it('base 1000, 10 hours, complex and urgent gives 22500', () => {
    const result = calculateProjectPrice({
      hourlyRate: 1000,
      projectHours: 10,
      complexityLevel: 'complex',
      urgencyLevel: 'urgent',
      expenseAmount: 0,
      taxPercent: 0,
    })
    expect(result?.adjustedHourlyRate).toBe(2250)
    expect(result?.totalProjectPrice).toBe(22_500)
  })

  it('adds expenses and tax from subtotal', () => {
    const result = calculateProjectPrice({
      hourlyRate: 1000,
      projectHours: 5,
      complexityLevel: 'simple',
      urgencyLevel: 'normal',
      expenseAmount: 2000,
      taxPercent: 10,
    })
    expect(result?.laborCost).toBe(5000)
    expect(result?.subtotal).toBe(7000)
    expect(result?.taxAmount).toBe(700)
    expect(result?.totalProjectPrice).toBe(7700)
  })

  it('accepts projectHours = 0', () => {
    const result = calculateProjectPrice({
      hourlyRate: 1000,
      projectHours: 0,
      complexityLevel: 'simple',
      urgencyLevel: 'normal',
      expenseAmount: 0,
      taxPercent: 0,
    })
    expect(result?.laborCost).toBe(0)
    expect(result?.totalProjectPrice).toBe(0)
  })
})

describe('multipliers', () => {
  it('returns complexity multipliers', () => {
    expect(getComplexityMultiplier('simple')).toBe(1)
    expect(getComplexityMultiplier('normal')).toBe(1.2)
    expect(getComplexityMultiplier('complex')).toBe(1.5)
    expect(getComplexityMultiplier('expert')).toBe(2)
  })

  it('returns urgency multipliers', () => {
    expect(getUrgencyMultiplier('normal')).toBe(1)
    expect(getUrgencyMultiplier('soon')).toBe(1.25)
    expect(getUrgencyMultiplier('urgent')).toBe(1.5)
  })

  it('calculates adjusted hourly rate', () => {
    expect(calculateAdjustedHourlyRate(1000, 1.5, 1.5)).toBe(2250)
  })
})

describe('validation', () => {
  it('validates positive numbers', () => {
    expect(isValidPositiveNumber(1)).toBe(true)
    expect(isValidPositiveNumber(0)).toBe(false)
    expect(isValidPositiveNumber(Number.NaN)).toBe(false)
    expect(isValidPositiveNumber(Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('validates non-negative numbers', () => {
    expect(isValidNonNegativeNumber(0)).toBe(true)
    expect(isValidNonNegativeNumber(1)).toBe(true)
    expect(isValidNonNegativeNumber(-1)).toBe(false)
    expect(isValidNonNegativeNumber(Number.NaN)).toBe(false)
    expect(isValidNonNegativeNumber(Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('rejects invalid inputs', () => {
    const base = {
      hourlyRate: 1000,
      projectHours: 1,
      complexityLevel: 'simple' as const,
      urgencyLevel: 'normal' as const,
      expenseAmount: 0,
      taxPercent: 0,
    }
    expect(calculateProjectPrice({ ...base, hourlyRate: 0 })).toBeNull()
    expect(calculateProjectPrice({ ...base, projectHours: -1 })).toBeNull()
    expect(calculateProjectPrice({ ...base, expenseAmount: -1 })).toBeNull()
    expect(calculateProjectPrice({ ...base, taxPercent: -1 })).toBeNull()
    expect(calculateProjectPrice({ ...base, taxPercent: 101 })).toBeNull()
  })
})
