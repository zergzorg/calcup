import type {
  ComplexityLevel,
  ProjectPriceInput,
  ProjectPriceResult,
  UrgencyLevel,
} from '../types/project-price'

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  simple: 1,
  normal: 1.2,
  complex: 1.5,
  expert: 2,
}

export const URGENCY_MULTIPLIERS: Record<UrgencyLevel, number> = {
  normal: 1,
  soon: 1.25,
  urgent: 1.5,
}

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function getComplexityMultiplier(complexityLevel: ComplexityLevel): number {
  return COMPLEXITY_MULTIPLIERS[complexityLevel]
}

export function getUrgencyMultiplier(urgencyLevel: UrgencyLevel): number {
  return URGENCY_MULTIPLIERS[urgencyLevel]
}

export function calculateAdjustedHourlyRate(
  hourlyRate: number,
  complexityMultiplier: number,
  urgencyMultiplier: number,
): number | null {
  if (!isValidPositiveNumber(hourlyRate)) return null
  if (!isValidPositiveNumber(complexityMultiplier)) return null
  if (!isValidPositiveNumber(urgencyMultiplier)) return null
  return hourlyRate * complexityMultiplier * urgencyMultiplier
}

export function calculateProjectPrice(input: ProjectPriceInput): ProjectPriceResult | null {
  if (!isValidPositiveNumber(input.hourlyRate)) return null
  if (!isValidNonNegativeNumber(input.projectHours)) return null
  if (!isValidNonNegativeNumber(input.expenseAmount)) return null
  if (!isValidNonNegativeNumber(input.taxPercent) || input.taxPercent > 100) return null

  const complexityMultiplier = getComplexityMultiplier(input.complexityLevel)
  const urgencyMultiplier = getUrgencyMultiplier(input.urgencyLevel)
  const adjustedHourlyRate = calculateAdjustedHourlyRate(
    input.hourlyRate,
    complexityMultiplier,
    urgencyMultiplier,
  )

  if (adjustedHourlyRate === null) return null

  const laborCost = adjustedHourlyRate * input.projectHours
  const subtotal = laborCost + input.expenseAmount
  const taxAmount = subtotal * input.taxPercent / 100
  const totalProjectPrice = subtotal + taxAmount

  return {
    complexityMultiplier,
    urgencyMultiplier,
    adjustedHourlyRate,
    laborCost,
    subtotal,
    taxAmount,
    totalProjectPrice,
  }
}
