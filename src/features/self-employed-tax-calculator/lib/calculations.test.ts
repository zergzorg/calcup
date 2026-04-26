import { describe, expect, it } from 'vitest'
import {
  ANNUAL_INCOME_LIMIT,
  BUSINESS_RATE,
  INDIVIDUAL_RATE,
  calculateSelfEmployedTax,
} from './calculations'

describe('self-employed tax calculations', () => {
  it('uses official 4% and 6% rates', () => {
    expect(INDIVIDUAL_RATE).toBe(0.04)
    expect(BUSINESS_RATE).toBe(0.06)
    expect(ANNUAL_INCOME_LIMIT).toBe(2_400_000)
  })

  it('calculates tax and automatic bonus use', () => {
    const result = calculateSelfEmployedTax({
      individualIncome: 100_000,
      businessIncome: 50_000,
      bonusBalance: 10_000,
    })

    expect(result?.totalIncome).toBe(150_000)
    expect(result?.individualTax).toBe(4000)
    expect(result?.businessTax).toBe(3000)
    expect(result?.taxBeforeBonus).toBe(7000)
    expect(result?.bonusUsed).toBe(2000)
    expect(result?.taxToPay).toBe(5000)
    expect(result?.netIncome).toBe(145_000)
    expect(result?.remainingLimit).toBe(2_250_000)
  })

  it('limits bonus use by the remaining bonus balance', () => {
    const result = calculateSelfEmployedTax({
      individualIncome: 100_000,
      businessIncome: 50_000,
      bonusBalance: 500,
    })

    expect(result?.bonusUsed).toBe(500)
    expect(result?.taxToPay).toBe(6500)
  })

  it('shows annual limit overage', () => {
    const result = calculateSelfEmployedTax({
      individualIncome: 2_500_000,
      businessIncome: 0,
      bonusBalance: 0,
    })

    expect(result?.remainingLimit).toBe(0)
    expect(result?.limitExceededBy).toBe(100_000)
  })

  it('rejects invalid inputs', () => {
    expect(calculateSelfEmployedTax({ individualIncome: -1, businessIncome: 0, bonusBalance: 0 })).toBeNull()
    expect(calculateSelfEmployedTax({ individualIncome: 0, businessIncome: Number.NaN, bonusBalance: 0 })).toBeNull()
    expect(calculateSelfEmployedTax({ individualIncome: 0, businessIncome: 0, bonusBalance: -1 })).toBeNull()
  })
})
