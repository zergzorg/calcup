import type { SelfEmployedTaxInput, SelfEmployedTaxResult } from '../types/self-employed-tax'

export const INDIVIDUAL_RATE = 0.04
export const BUSINESS_RATE = 0.06
export const INDIVIDUAL_BONUS_RATE = 0.01
export const BUSINESS_BONUS_RATE = 0.02
export const ANNUAL_INCOME_LIMIT = 2_400_000

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function calculateSelfEmployedTax(input: SelfEmployedTaxInput): SelfEmployedTaxResult | null {
  if (
    !isValidNonNegativeNumber(input.individualIncome) ||
    !isValidNonNegativeNumber(input.businessIncome) ||
    !isValidNonNegativeNumber(input.bonusBalance)
  ) {
    return null
  }

  const totalIncome = roundMoney(input.individualIncome + input.businessIncome)
  const individualTax = roundMoney(input.individualIncome * INDIVIDUAL_RATE)
  const businessTax = roundMoney(input.businessIncome * BUSINESS_RATE)
  const taxBeforeBonus = roundMoney(individualTax + businessTax)

  const possibleBonusUse = roundMoney(
    input.individualIncome * INDIVIDUAL_BONUS_RATE +
    input.businessIncome * BUSINESS_BONUS_RATE,
  )
  const bonusUsed = roundMoney(Math.min(input.bonusBalance, possibleBonusUse, taxBeforeBonus))
  const taxToPay = roundMoney(taxBeforeBonus - bonusUsed)

  return {
    totalIncome,
    individualTax,
    businessTax,
    taxBeforeBonus,
    bonusUsed,
    taxToPay,
    netIncome: roundMoney(totalIncome - taxToPay),
    annualLimit: ANNUAL_INCOME_LIMIT,
    remainingLimit: roundMoney(Math.max(0, ANNUAL_INCOME_LIMIT - totalIncome)),
    limitExceededBy: roundMoney(Math.max(0, totalIncome - ANNUAL_INCOME_LIMIT)),
  }
}
