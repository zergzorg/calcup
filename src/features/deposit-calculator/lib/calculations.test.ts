import { describe, expect, it } from 'vitest'
import {
  calculateDeposit,
  calculateMonthlyCapitalizedAmount,
  calculateSimpleDepositIncome,
} from './calculations'

describe('deposit calculations', () => {
  it('calculates simple interest income', () => {
    expect(calculateSimpleDepositIncome(1_000_000, 12, 12)).toBe(120_000)
    expect(calculateSimpleDepositIncome(500_000, 9, 6)).toBe(22_500)
  })

  it('calculates monthly capitalization final amount', () => {
    expect(calculateMonthlyCapitalizedAmount(1_000_000, 12, 12)).toBe(1_126_825.03)
    expect(calculateMonthlyCapitalizedAmount(500_000, 9, 6)).toBe(522_926.12)
  })

  it('returns a full simple interest result', () => {
    expect(calculateDeposit({
      initialAmount: 1_000_000,
      annualRate: 12,
      termMonths: 12,
      mode: 'simple',
    })).toEqual({
      initialAmount: 1_000_000,
      annualRate: 12,
      termMonths: 12,
      mode: 'simple',
      income: 120_000,
      finalAmount: 1_120_000,
      effectiveGrowthPercent: 12,
    })
  })

  it('returns a full capitalization result', () => {
    expect(calculateDeposit({
      initialAmount: 1_000_000,
      annualRate: 12,
      termMonths: 12,
      mode: 'monthlyCapitalization',
    })).toEqual({
      initialAmount: 1_000_000,
      annualRate: 12,
      termMonths: 12,
      mode: 'monthlyCapitalization',
      income: 126_825.03,
      finalAmount: 1_126_825.03,
      effectiveGrowthPercent: 12.68,
    })
  })

  it('rejects invalid input', () => {
    expect(calculateDeposit({ initialAmount: 0, annualRate: 12, termMonths: 12, mode: 'simple' })).toBeNull()
    expect(calculateDeposit({ initialAmount: 1_000_000, annualRate: -1, termMonths: 12, mode: 'simple' })).toBeNull()
    expect(calculateDeposit({ initialAmount: 1_000_000, annualRate: 12, termMonths: 0, mode: 'simple' })).toBeNull()
  })
})
