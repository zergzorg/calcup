import type { LaminateInput, LaminateResult } from '../types/laminate'

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function calculateLaminate(input: LaminateInput): LaminateResult | null {
  if (!isPositive(input.roomLength) || !isPositive(input.roomWidth)) return null
  if (!isNonNegative(input.excludedArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.packPrice)) return null
  if (!isPositive(input.packCoverage)) return null

  const grossArea = input.roomLength * input.roomWidth
  if (input.excludedArea >= grossArea) return null

  const netArea = grossArea - input.excludedArea
  const materialArea = netArea * (1 + input.wastePercent / 100)
  const packsNeeded = Math.ceil(materialArea / input.packCoverage)
  const purchaseArea = packsNeeded * input.packCoverage

  return {
    grossArea: roundTo(grossArea, 2),
    netArea: roundTo(netArea, 2),
    materialArea: roundTo(materialArea, 2),
    packsNeeded,
    purchaseArea: roundTo(purchaseArea, 2),
    leftoverArea: roundTo(purchaseArea - materialArea, 2),
    totalCost: input.packPrice > 0 ? roundTo(packsNeeded * input.packPrice, 2) : null,
  }
}
