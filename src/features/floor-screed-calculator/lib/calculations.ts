import type { FloorScreedInput, FloorScreedResult } from '../types/floor-screed'

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

export function calculateFloorScreed(input: FloorScreedInput): FloorScreedResult | null {
  if (!isPositive(input.roomLength) || !isPositive(input.roomWidth)) return null
  if (!isPositive(input.thicknessMm) || !isPositive(input.consumptionKgPerM2Mm) || !isPositive(input.bagWeight)) return null
  if (!isNonNegative(input.excludedArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.bagPrice)) return null

  const grossArea = input.roomLength * input.roomWidth
  if (input.excludedArea >= grossArea) return null

  const netArea = grossArea - input.excludedArea
  const volumeM3 = netArea * (input.thicknessMm / 1000)
  const dryMixKg = netArea * input.thicknessMm * input.consumptionKgPerM2Mm * (1 + input.wastePercent / 100)
  const bagsNeeded = Math.ceil(dryMixKg / input.bagWeight)
  const purchaseKg = bagsNeeded * input.bagWeight

  return {
    grossArea: roundTo(grossArea, 2),
    netArea: roundTo(netArea, 2),
    volumeM3: roundTo(volumeM3, 3),
    dryMixKg: roundTo(dryMixKg, 1),
    bagsNeeded,
    purchaseKg: roundTo(purchaseKg, 1),
    leftoverKg: roundTo(purchaseKg - dryMixKg, 1),
    totalCost: input.bagPrice > 0 ? roundTo(bagsNeeded * input.bagPrice, 2) : null,
  }
}
