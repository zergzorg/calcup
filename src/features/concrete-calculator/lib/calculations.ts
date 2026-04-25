import type { ConcreteInput, ConcreteResult } from '../types/concrete'

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

export function calculateConcrete(input: ConcreteInput): ConcreteResult | null {
  if (!isPositive(input.lengthM) || !isPositive(input.widthM) || !isPositive(input.thicknessMm)) return null
  if (!isPositive(input.bagYieldLiters)) return null
  if (!isNonNegative(input.wastePercent) || !isNonNegative(input.pricePerM3)) return null

  const area = input.lengthM * input.widthM
  const baseVolumeM3 = area * input.thicknessMm / 1000
  const volumeWithWasteM3 = baseVolumeM3 * (1 + input.wastePercent / 100)
  const volumeLiters = volumeWithWasteM3 * 1000
  const bagsNeeded = Math.ceil(volumeLiters / input.bagYieldLiters)
  const purchaseLiters = bagsNeeded * input.bagYieldLiters

  return {
    area: roundTo(area, 2),
    baseVolumeM3: roundTo(baseVolumeM3, 3),
    volumeWithWasteM3: roundTo(volumeWithWasteM3, 3),
    volumeLiters: roundTo(volumeLiters, 1),
    bagsNeeded,
    purchaseLiters: roundTo(purchaseLiters, 1),
    leftoverLiters: roundTo(purchaseLiters - volumeLiters, 1),
    totalCost: input.pricePerM3 > 0 ? roundTo(volumeWithWasteM3 * input.pricePerM3, 2) : null,
  }
}
