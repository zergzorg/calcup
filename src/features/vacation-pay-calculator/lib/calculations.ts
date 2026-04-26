import { TAX_2026_CONFIG } from '../../../config'
import type { VacationPayInput, VacationPayResult } from '../types/vacation-pay'

export const AVERAGE_CALENDAR_DAYS_PER_MONTH = TAX_2026_CONFIG.vacationPay.averageCalendarDaysPerMonth

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function calculateAccountingDays(fullMonths: number, partialMonthDays: number): number | null {
  if (!isValidNonNegativeNumber(fullMonths) || !isValidNonNegativeNumber(partialMonthDays)) {
    return null
  }

  if (fullMonths > 12 || partialMonthDays > 31) {
    return null
  }

  const days = fullMonths * AVERAGE_CALENDAR_DAYS_PER_MONTH + partialMonthDays
  return days > 0 ? days : null
}

export function calculateVacationPay(input: VacationPayInput): VacationPayResult | null {
  if (!isValidPositiveNumber(input.earnings)) return null
  if (!isValidPositiveNumber(input.vacationDays)) return null
  if (!isValidNonNegativeNumber(input.taxPercent) || input.taxPercent > 100) return null

  const accountingDays = calculateAccountingDays(input.fullMonths, input.partialMonthDays)
  if (accountingDays === null) return null

  const averageDailyEarnings = roundMoney(input.earnings / accountingDays)
  const grossVacationPay = roundMoney(averageDailyEarnings * input.vacationDays)
  const taxAmount = roundMoney(grossVacationPay * input.taxPercent / 100)

  return {
    accountingDays: roundMoney(accountingDays),
    averageDailyEarnings,
    grossVacationPay,
    taxAmount,
    netVacationPay: roundMoney(grossVacationPay - taxAmount),
  }
}
