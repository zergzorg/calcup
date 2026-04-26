import { describe, expect, it } from 'vitest'
import {
  EXPERIENCE_RATES,
  MAX_AVERAGE_DAILY_2026,
  MIN_DAILY_BENEFIT_2026,
  MROT_2026,
  calculateSickLeave,
} from './calculations'

describe('sick leave calculations', () => {
  it('uses 2026 constants and experience rates', () => {
    expect(MROT_2026).toBe(27_093)
    expect(MIN_DAILY_BENEFIT_2026).toBe(890.73)
    expect(MAX_AVERAGE_DAILY_2026).toBe(6827.40)
    expect(EXPERIENCE_RATES).toEqual({ under5: 0.6, from5to8: 0.8, over8: 1 })
  })

  it('calculates gross, tax, net and payer split', () => {
    const result = calculateSickLeave({
      income2024: 1_000_000,
      income2025: 1_500_000,
      sickDays: 10,
      experience: 'from5to8',
      taxPercent: 13,
    })

    expect(result?.totalIncome).toBe(2_500_000)
    expect(result?.rawAverageDaily).toBe(3424.66)
    expect(result?.dailyBenefit).toBe(2739.73)
    expect(result?.grossBenefit).toBe(27_397.30)
    expect(result?.taxAmount).toBe(3561.65)
    expect(result?.netBenefit).toBe(23_835.65)
    expect(result?.employerGross).toBe(8219.19)
    expect(result?.fundGross).toBe(19_178.11)
  })

  it('applies minimum daily benefit for low income', () => {
    const result = calculateSickLeave({
      income2024: 0,
      income2025: 0,
      sickDays: 5,
      experience: 'under5',
      taxPercent: 13,
    })

    expect(result?.dailyBenefit).toBe(MIN_DAILY_BENEFIT_2026)
    expect(result?.grossBenefit).toBe(4453.65)
  })

  it('caps maximum average daily earnings before applying experience rate', () => {
    const result = calculateSickLeave({
      income2024: 5_000_000,
      income2025: 5_000_000,
      sickDays: 1,
      experience: 'under5',
      taxPercent: 0,
    })

    expect(result?.dailyBenefit).toBe(4096.44)
  })

  it('rejects invalid inputs', () => {
    expect(calculateSickLeave({ income2024: -1, income2025: 0, sickDays: 1, experience: 'over8', taxPercent: 13 })).toBeNull()
    expect(calculateSickLeave({ income2024: 0, income2025: Number.NaN, sickDays: 1, experience: 'over8', taxPercent: 13 })).toBeNull()
    expect(calculateSickLeave({ income2024: 0, income2025: 0, sickDays: 0, experience: 'over8', taxPercent: 13 })).toBeNull()
    expect(calculateSickLeave({ income2024: 0, income2025: 0, sickDays: 1, experience: 'over8', taxPercent: 101 })).toBeNull()
  })
})
