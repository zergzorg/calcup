import { describe, expect, it } from 'vitest'
import {
  calculateBudget,
  calculateDebtLoad,
  calculateInflation,
  calculateRentVsBuy,
  calculateTaxDeduction,
} from './calculations'

describe('finance MVP calculators', () => {
  it('calculates monthly budget free cash and rates', () => {
    const result = calculateBudget({ income: 150_000, expenses: 80_000, debtPayments: 25_000, savings: 20_000 })

    expect(result?.primary.value).toBe(25_000)
    expect(result?.rows.find(row => row.key === 'savingsRate')?.value).toBe(13.33)
  })

  it('calculates inflation-adjusted values and real return', () => {
    const result = calculateInflation({ amount: 100_000, inflationRate: 7, years: 3, nominalReturn: 10 })

    expect(result?.primary.value).toBe(122_504.30)
    expect(result?.rows.find(row => row.key === 'purchasingPower')?.value).toBe(81_629.79)
    expect(result?.rows.find(row => row.key === 'realReturn')?.value).toBe(2.8)
  })

  it('caps tax deduction by limit and paid tax', () => {
    const result = calculateTaxDeduction({ expenses: 200_000, limit: 150_000, ratePercent: 13, taxPaid: 10_000 })

    expect(result?.primary.value).toBe(10_000)
    expect(result?.rows.find(row => row.key === 'base')?.value).toBe(150_000)
  })

  it('calculates debt load', () => {
    const result = calculateDebtLoad({ monthlyIncome: 120_000, creditPayments: 35_000, otherDebtPayments: 10_000 })

    expect(result?.primary.value).toBe(37.5)
    expect(result?.rows.find(row => row.key === 'freeIncome')?.value).toBe(75_000)
  })

  it('compares rent and buy cash-out', () => {
    const result = calculateRentVsBuy({ rent: 60_000, mortgagePayment: 90_000, ownershipCosts: 12_000, horizonYears: 5, downPayment: 1_500_000 })

    expect(result?.primary.key).toBe('rentAdvantage')
    expect(result?.primary.value).toBe(4_020_000)
  })
})
