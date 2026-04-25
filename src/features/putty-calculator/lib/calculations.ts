import type { PuttyInput, PuttyResult } from '../types/putty'

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

export function calculatePutty(input: PuttyInput): PuttyResult | null {
  if (!isPositive(input.surfaceArea) || !isPositive(input.layerThicknessMm)) return null
  if (!isPositive(input.consumptionKgPerM2Mm) || !isPositive(input.bagWeightKg)) return null
  if (!isNonNegative(input.excludedArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.bagPrice)) return null
  if (input.excludedArea >= input.surfaceArea) return null

  const netArea = input.surfaceArea - input.excludedArea
  const mixKg = netArea * input.layerThicknessMm * input.consumptionKgPerM2Mm * (1 + input.wastePercent / 100)
  const bagsNeeded = Math.ceil(mixKg / input.bagWeightKg)
  const purchaseKg = bagsNeeded * input.bagWeightKg

  return {
    grossArea: roundTo(input.surfaceArea, 2),
    netArea: roundTo(netArea, 2),
    mixKg: roundTo(mixKg, 1),
    bagsNeeded,
    purchaseKg: roundTo(purchaseKg, 1),
    leftoverKg: roundTo(purchaseKg - mixKg, 1),
    totalCost: input.bagPrice > 0 ? roundTo(bagsNeeded * input.bagPrice, 2) : null,
  }
}
