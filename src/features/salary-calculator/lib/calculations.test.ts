import { describe, expect, it } from 'vitest'
import {
  calculateAverageWorkDaysPerMonth,
  calculateAverageWorkHoursPerMonth,
  calculateBaseSalary,
  calculateSalary,
  calculateMonthlyProgressiveNdflBreakdown,
  calculateMonthlySalaryAfterTax,
  calculateProgressiveNdfl,
  calculateSalaryTaxAmount,
  getWorkDaysPerYear,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from './calculations'
import type { SalaryInput } from '../types/salary'

function makeInput(overrides: Partial<SalaryInput> = {}): SalaryInput {
  return {
    monthlySalary: 160_000,
    salaryTaxMode: 'custom',
    customSalaryTaxPercent: 0,
    additionalIncomes: [],
    scheduleType: 'custom',
    hoursPerWorkDay: 8,
    customWorkDaysPerYear: 240,
    ...overrides,
  }
}

describe('base hourly rate', () => {
  it('calculates fiveTwo salary 120000 and 8 hours/day', () => {
    const workDays = getWorkDaysPerYear('fiveTwo')
    expect(workDays).toBe(247)
    expect(calculateAverageWorkDaysPerMonth(workDays!)).toBeCloseTo(247 / 12, 8)
    expect(calculateAverageWorkHoursPerMonth(workDays!, 8)).toBeCloseTo((247 / 12) * 8, 8)
    expect(calculateBaseSalary(120_000, workDays!, 8)).toBeCloseTo(728.74, 2)
  })

  it('calculates twoTwo salary 100000 and 12 hours/day', () => {
    expect(calculateBaseSalary(100_000, getWorkDaysPerYear('twoTwo')!, 12)).toBeCloseTo(546.45, 2)
  })

  it('calculates dayThree salary 90000 and 24 hours/day', () => {
    expect(calculateBaseSalary(90_000, getWorkDaysPerYear('dayThree')!, 24)).toBeCloseTo(489.13, 2)
  })

  it('uses customWorkDaysPerYear only for custom schedule', () => {
    expect(getWorkDaysPerYear('custom', 220)).toBe(220)
    expect(getWorkDaysPerYear('fiveTwo', 220)).toBe(247)
  })
})

describe('salary and hourly calculation', () => {
  it('calculates base hourly rate from monthly income after tax', () => {
    const result = calculateSalary(makeInput())
    expect(result?.baseSalary).toBe(1000)
    expect(result?.monthlyTotalIncomeAfterTax).toBe(160_000)
    expect(result?.workDayPrice).toBe(8000)
  })

  it('adds all additional income rows after tax to hourly rate base', () => {
    const result = calculateSalary(makeInput({
      additionalIncomes: [
        { amount: 40_000, taxPercent: 13 },
        { amount: 10_000, taxPercent: 6 },
      ],
    }))
    expect(result?.additionalIncomeTaxAmount).toBe(5800)
    expect(result?.annualAdditionalIncome).toBe(600_000)
    expect(result?.monthlyTotalIncomeAfterTax).toBe(204_200)
    expect(result?.baseSalary).toBeCloseTo(1276.25, 2)
  })
})

describe('salary tax', () => {
  it('calculates 13% for annual income up to 2.4M', () => {
    expect(calculateProgressiveNdfl(2_400_000)).toBe(312_000)
    expect(calculateSalaryTaxAmount(120_000, 'russiaProgressive', 13)).toBe(15_600)
    expect(calculateMonthlySalaryAfterTax(120_000, 'russiaProgressive', 13)).toBe(104_400)
  })

  it('taxes only threshold excess at higher rates', () => {
    expect(calculateProgressiveNdfl(6_000_000)).toBe(882_000)
  })

  it('uses custom salary tax percent', () => {
    expect(calculateSalaryTaxAmount(100_000, 'custom', 6)).toBe(6000)
    expect(calculateMonthlySalaryAfterTax(100_000, 'custom', 6)).toBe(94_000)
  })

  it('builds monthly progressive tax breakdown', () => {
    const breakdown = calculateMonthlyProgressiveNdflBreakdown(500_000)
    expect(breakdown).toHaveLength(12)
    expect(breakdown?.[0].taxAmount).toBe(65_000)
    expect(breakdown?.[3].taxAmount).toBe(65_000)
    expect(breakdown?.[4].taxAmount).toBe(67_000)
    expect(breakdown?.[9].taxAmount).toBe(75_000)
    expect(breakdown?.[10].taxAmount).toBe(90_000)
    expect(breakdown?.[11].salaryAfterTax).toBe(410_000)
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

  it('rejects salary = 0', () => {
    expect(calculateSalary(makeInput({ monthlySalary: 0 }))).toBeNull()
  })

  it('rejects hoursPerWorkDay = 0', () => {
    expect(calculateAverageWorkHoursPerMonth(247, 0)).toBeNull()
    expect(calculateSalary(makeInput({ hoursPerWorkDay: 0 }))).toBeNull()
  })

  it('rejects hoursPerWorkDay > 24', () => {
    expect(calculateAverageWorkHoursPerMonth(247, 25)).toBeNull()
    expect(calculateSalary(makeInput({ hoursPerWorkDay: 25 }))).toBeNull()
  })

  it('rejects customWorkDaysPerYear = 0', () => {
    expect(getWorkDaysPerYear('custom', 0)).toBeNull()
  })

  it('rejects customWorkDaysPerYear > 366', () => {
    expect(getWorkDaysPerYear('custom', 367)).toBeNull()
  })

  it('rejects custom salary tax > 100', () => {
    expect(calculateSalary(makeInput({ customSalaryTaxPercent: 101 }))).toBeNull()
  })

  it('rejects negative additional income', () => {
    expect(calculateSalary(makeInput({
      additionalIncomes: [{ amount: -1, taxPercent: 13 }],
    }))).toBeNull()
  })

  it('rejects additional income tax > 100', () => {
    expect(calculateSalary(makeInput({
      additionalIncomes: [{ amount: 10_000, taxPercent: 101 }],
    }))).toBeNull()
  })
})
