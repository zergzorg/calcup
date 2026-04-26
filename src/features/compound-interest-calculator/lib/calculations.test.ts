import { describe, expect, it } from 'vitest'
import {
  calculateCompoundInterest,
  calculateFutureValue,
  calculateOwnContributions,
} from './calculations'

describe('compound interest calculations', () => {
  it('calculates own contributions', () => {
    expect(calculateOwnContributions(100_000, 10_000, 120)).toBe(1_300_000)
    expect(calculateOwnContributions(0, 5_000, 60)).toBe(300_000)
  })

  it('calculates future value with monthly capitalization and end-of-month contributions', () => {
    expect(calculateFutureValue({
      initialAmount: 100_000,
      monthlyContribution: 10_000,
      annualRate: 10,
      termYears: 10,
    })).toBe(2_319_153.94)

    expect(calculateFutureValue({
      initialAmount: 0,
      monthlyContribution: 5_000,
      annualRate: 8,
      termYears: 5,
    })).toBe(367_384.28)
  })

  it('returns a full result', () => {
    expect(calculateCompoundInterest({
      initialAmount: 100_000,
      monthlyContribution: 10_000,
      annualRate: 10,
      termYears: 10,
    })).toEqual({
      initialAmount: 100_000,
      monthlyContribution: 10_000,
      annualRate: 10,
      termYears: 10,
      termMonths: 120,
      ownContributions: 1_300_000,
      interestEarned: 1_019_153.94,
      finalAmount: 2_319_153.94,
      effectiveGrowthPercent: 78.4,
    })
  })

  it('supports zero monthly contribution', () => {
    expect(calculateCompoundInterest({
      initialAmount: 500_000,
      monthlyContribution: 0,
      annualRate: 12,
      termYears: 10,
    })?.finalAmount).toBe(1_650_193.45)
  })

  it('rejects invalid input', () => {
    expect(calculateCompoundInterest({ initialAmount: 0, monthlyContribution: 0, annualRate: 10, termYears: 10 })).toBeNull()
    expect(calculateCompoundInterest({ initialAmount: -1, monthlyContribution: 10_000, annualRate: 10, termYears: 10 })).toBeNull()
    expect(calculateCompoundInterest({ initialAmount: 100_000, monthlyContribution: -1, annualRate: 10, termYears: 10 })).toBeNull()
    expect(calculateCompoundInterest({ initialAmount: 100_000, monthlyContribution: 10_000, annualRate: -1, termYears: 10 })).toBeNull()
    expect(calculateCompoundInterest({ initialAmount: 100_000, monthlyContribution: 10_000, annualRate: 10, termYears: 0 })).toBeNull()
  })
})
