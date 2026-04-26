import { describe, expect, it } from 'vitest'
import { calculateMonthlyPayment, calculateRefinance } from './calculations'

describe('refinance calculations', () => {
  it('calculates annuity payments', () => {
    expect(calculateMonthlyPayment(1_000_000, 16, 36)).toBe(35_157.03)
    expect(calculateMonthlyPayment(1_000_000, 12, 36)).toBe(33_214.31)
    expect(calculateMonthlyPayment(120_000, 0, 12)).toBe(10_000)
  })

  it('compares old and new loan totals', () => {
    expect(calculateRefinance({
      outstandingBalance: 1_000_000,
      oldAnnualRate: 16,
      oldTermMonths: 36,
      newAnnualRate: 12,
      newTermMonths: 36,
      refinancingCost: 15_000,
    })).toEqual({
      outstandingBalance: 1_000_000,
      oldMonthlyPayment: 35_157.03,
      newMonthlyPayment: 33_214.31,
      oldTotalPayment: 1_265_653.08,
      newTotalPayment: 1_210_715.16,
      totalSavings: 54_937.92,
      monthlySavings: 1_942.72,
      paybackMonths: 8,
      isBeneficial: true,
    })
  })

  it('marks a more expensive refinance as not beneficial', () => {
    const result = calculateRefinance({
      outstandingBalance: 1_000_000,
      oldAnnualRate: 10,
      oldTermMonths: 36,
      newAnnualRate: 14,
      newTermMonths: 36,
      refinancingCost: 20_000,
    })

    expect(result?.isBeneficial).toBe(false)
    expect(result?.paybackMonths).toBeNull()
  })

  it('rejects invalid input', () => {
    expect(calculateRefinance({ outstandingBalance: 0, oldAnnualRate: 16, oldTermMonths: 36, newAnnualRate: 12, newTermMonths: 36, refinancingCost: 0 })).toBeNull()
    expect(calculateRefinance({ outstandingBalance: 1_000_000, oldAnnualRate: -1, oldTermMonths: 36, newAnnualRate: 12, newTermMonths: 36, refinancingCost: 0 })).toBeNull()
    expect(calculateRefinance({ outstandingBalance: 1_000_000, oldAnnualRate: 16, oldTermMonths: 0, newAnnualRate: 12, newTermMonths: 36, refinancingCost: 0 })).toBeNull()
    expect(calculateRefinance({ outstandingBalance: 1_000_000, oldAnnualRate: 16, oldTermMonths: 36, newAnnualRate: 12, newTermMonths: 36, refinancingCost: -1 })).toBeNull()
  })
})
