import { describe, expect, it } from 'vitest'
import {
  IP_EXTRA_MAX_2026,
  IP_FIXED_INSURANCE_2026,
  calculateDismissalPay,
  calculateIpInsurance,
  calculatePenaltyInterest,
  calculateUsnTax,
  calculateWorkExperience,
  calculateWorkHoursMonth,
} from './calculations'

describe('work MVP calculators', () => {
  it('calculates USN income and income-minus-expenses modes', () => {
    const result = calculateUsnTax({ income: 2_000_000, expenses: 1_200_000, contributions: 60_000 })

    expect(result?.primary.value).toBe(60_000)
    expect(result?.rows.find(row => row.key === 'usnIncomeMinusExpensesTax')?.value).toBe(120_000)
    expect(result?.rows.find(row => row.key === 'minTax')?.value).toBe(20_000)
  })

  it('calculates 2026 IP insurance payments', () => {
    const result = calculateIpInsurance({ income: 1_500_000, activeMonths: 12 })

    expect(IP_FIXED_INSURANCE_2026).toBe(57_390)
    expect(IP_EXTRA_MAX_2026).toBe(321_818)
    expect(result?.primary.value).toBe(69_390)
  })

  it('caps IP extra insurance payment', () => {
    const result = calculateIpInsurance({ income: 50_000_000, activeMonths: 12 })

    expect(result?.rows.find(row => row.key === 'extra')?.value).toBe(IP_EXTRA_MAX_2026)
  })

  it('calculates penalty interest by key rate divisor', () => {
    const result = calculatePenaltyInterest({ debt: 100_000, days: 30, keyRate: 16, divisor: 300 })

    expect(result?.primary.value).toBe(1600)
    expect(result?.rows.find(row => row.key === 'totalDebt')?.value).toBe(101_600)
  })

  it('calculates dismissal pay MVP', () => {
    const result = calculateDismissalPay({
      averageDaily: 3500,
      unusedVacationDays: 10,
      severanceAverageMonthly: 90_000,
      severanceMonths: 1,
      taxPercent: 13,
    })

    expect(result?.primary.value).toBe(120_450)
    expect(result?.rows.find(row => row.key === 'tax')?.value).toBe(4550)
  })

  it('calculates work hours for a month with fixed holidays', () => {
    const result = calculateWorkHoursMonth({ year: 2026, month: 1, weeklyHours: 40 })

    expect(result?.primary.value).toBe(128)
    expect(result?.rows.find(row => row.key === 'workdays')?.value).toBe(16)
  })

  it('calculates work experience between two dates', () => {
    const result = calculateWorkExperience({
      startYear: 2020,
      startMonth: 2,
      startDay: 15,
      endYear: 2026,
      endMonth: 4,
      endDay: 26,
    })

    expect(result?.primary.value).toBe(6)
    expect(result?.rows.find(row => row.key === 'months')?.value).toBe(2)
    expect(result?.rows.find(row => row.key === 'days')?.value).toBe(11)
  })
})
