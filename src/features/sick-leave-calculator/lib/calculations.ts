import { TAX_2026_CONFIG } from '../../../config'
import type { SickLeaveExperience, SickLeaveInput, SickLeaveResult } from '../types/sick-leave'

export const MROT_2026 = TAX_2026_CONFIG.sickLeave.mrot
export const MIN_DAILY_BENEFIT_2026 = TAX_2026_CONFIG.sickLeave.minDailyBenefit
export const MAX_AVERAGE_DAILY_2026 = TAX_2026_CONFIG.sickLeave.maxAverageDaily

export const EXPERIENCE_RATES: Record<SickLeaveExperience, number> = {
  under5: TAX_2026_CONFIG.sickLeave.experienceRates.under5,
  from5to8: TAX_2026_CONFIG.sickLeave.experienceRates.from5to8,
  over8: TAX_2026_CONFIG.sickLeave.experienceRates.over8,
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function calculateSickLeave(input: SickLeaveInput): SickLeaveResult | null {
  if (!isValidNonNegativeNumber(input.income2024)) return null
  if (!isValidNonNegativeNumber(input.income2025)) return null
  if (!isValidPositiveNumber(input.sickDays)) return null
  if (!isValidNonNegativeNumber(input.taxPercent) || input.taxPercent > 100) return null

  const experienceRate = EXPERIENCE_RATES[input.experience]
  if (!experienceRate) return null

  const totalIncome = roundMoney(input.income2024 + input.income2025)
  const rawAverageDaily = roundMoney(totalIncome / 730)
  const cappedAverageDaily = Math.min(rawAverageDaily, MAX_AVERAGE_DAILY_2026)
  const dailyBenefit = roundMoney(Math.max(MIN_DAILY_BENEFIT_2026, cappedAverageDaily * experienceRate))
  const grossBenefit = roundMoney(dailyBenefit * input.sickDays)
  const taxAmount = roundMoney(grossBenefit * input.taxPercent / 100)
  const employerDays = Math.min(input.sickDays, 3)
  const fundDays = Math.max(0, input.sickDays - employerDays)

  return {
    totalIncome,
    rawAverageDaily,
    dailyBenefit,
    grossBenefit,
    taxAmount,
    netBenefit: roundMoney(grossBenefit - taxAmount),
    employerGross: roundMoney(dailyBenefit * employerDays),
    fundGross: roundMoney(dailyBenefit * fundDays),
    employerDays,
    fundDays,
    experienceRate,
  }
}
