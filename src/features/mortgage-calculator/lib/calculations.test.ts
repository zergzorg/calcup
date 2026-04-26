import { describe, expect, it } from 'vitest'
import {
  buildPaymentSchedule,
  calculateDownPaymentAmount,
  calculateExtendedMortgagePrincipal,
  calculateMonthlyPayment,
  calculateMortgage,
  calculateMortgagePrincipal,
} from './calculations'

describe('mortgage calculations', () => {
  it('calculates down payment and principal', () => {
    expect(calculateDownPaymentAmount(8_000_000, 20)).toBe(1_600_000)
    expect(calculateMortgagePrincipal(8_000_000, 20)).toBe(6_400_000)
    expect(calculateExtendedMortgagePrincipal(8_000_000, 20, 500_000, 100_000)).toBe(5_800_000)
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
      additionalContribution: 0,
      monthlyCosts: 0,
      oneTimeFees: 0,
      earlyPayment: 0,
      extraMonthlyPayment: 0,
    })).toMatchObject({
      propertyPrice: 8_000_000,
      downPaymentAmount: 1_600_000,
      additionalContribution: 0,
      principal: 6_400_000,
      termMonths: 240,
      monthlyPayment: 70469.51,
      monthlyCashOut: 70469.51,
      totalPayment: 16_912_682.4,
      totalCashOut: 18_512_682.4,
      overpayment: 10_512_682.4,
      baseOverpayment: 10_512_682.4,
      savedInterest: 0,
      actualTermMonths: 240,
      loanToValuePercent: 80,
    })
  })

  it('builds a schedule and shows savings from extra payments', () => {
    const schedule = buildPaymentSchedule(1_000_000, 12, 24, 47_073.47, 10_000)
    expect(schedule?.[0]).toMatchObject({ month: 1, interest: 10_000, principal: 47_073.47 })

    const result = calculateMortgage({
      propertyPrice: 8_000_000,
      downPaymentPercent: 20,
      annualRate: 12,
      termYears: 20,
      additionalContribution: 500_000,
      monthlyCosts: 5_000,
      oneTimeFees: 100_000,
      earlyPayment: 100_000,
      extraMonthlyPayment: 20_000,
    })

    expect(result?.principal).toBe(5_800_000)
    expect(result?.savedInterest).toBeGreaterThan(0)
    expect(result?.actualTermMonths).toBeLessThan(240)
    expect(result?.schedulePreview).toHaveLength(12)
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
      additionalContribution: 0,
      monthlyCosts: 0,
      oneTimeFees: 0,
      earlyPayment: 0,
      extraMonthlyPayment: 0,
    })).toBeNull()
  })
})
