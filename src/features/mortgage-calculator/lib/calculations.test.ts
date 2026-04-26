import { describe, expect, it } from 'vitest'
import {
  calculateDownPaymentAmount,
  calculateMonthlyPayment,
  calculateMortgage,
  calculateMortgagePrincipal,
} from './calculations'

describe('mortgage calculations', () => {
  it('calculates down payment and principal', () => {
    expect(calculateDownPaymentAmount(8_000_000, 20)).toBe(1_600_000)
    expect(calculateMortgagePrincipal(8_000_000, 20)).toBe(6_400_000)
  })

  it('calculates an annuity monthly payment', () => {
    expect(calculateMonthlyPayment(6_400_000, 12, 240)).toBe(70469.51)
  })

  it('supports zero interest rate', () => {
    expect(calculateMonthlyPayment(6_000_000, 0, 120)).toBe(50_000)
  })

  it('returns a full mortgage summary', () => {
    expect(calculateMortgage({
      propertyPrice: 8_000_000,
      downPaymentPercent: 20,
      annualRate: 12,
      termYears: 20,
    })).toEqual({
      propertyPrice: 8_000_000,
      downPaymentAmount: 1_600_000,
      principal: 6_400_000,
      termMonths: 240,
      monthlyPayment: 70469.51,
      totalPayment: 16_912_682.4,
      overpayment: 10_512_682.4,
      loanToValuePercent: 80,
    })
  })

  it('returns null for invalid input values', () => {
    expect(calculateDownPaymentAmount(0, 20)).toBeNull()
    expect(calculateDownPaymentAmount(8_000_000, 100)).toBeNull()
    expect(calculateMonthlyPayment(0, 12, 240)).toBeNull()
    expect(calculateMonthlyPayment(6_400_000, -1, 240)).toBeNull()
    expect(calculateMortgage({
      propertyPrice: Number.NaN,
      downPaymentPercent: 20,
      annualRate: 12,
      termYears: 20,
    })).toBeNull()
  })
})
