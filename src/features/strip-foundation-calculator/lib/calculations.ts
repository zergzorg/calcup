import type { StripFoundationInput, StripFoundationResult } from '../types/strip-foundation'

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

export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

export function rebarWeightPerMeter(diameterMm: number): number | null {
  if (!isPositive(diameterMm)) return null

  return roundTo((diameterMm * diameterMm) / 162, 3)
}

export function calculateStripFoundation(input: StripFoundationInput): StripFoundationResult | null {
  if (!isPositive(input.totalLengthM) || !isPositive(input.widthMm) || !isPositive(input.heightMm)) return null
  if (!isNonNegative(input.sandDepthMm) || !isNonNegative(input.wastePercent)) return null
  if (!isPositiveInteger(input.rebarRuns) || !isPositive(input.rebarDiameterMm)) return null
  if (!isNonNegative(input.concretePricePerM3) || !isNonNegative(input.rebarPricePerKg)) return null

  const widthM = input.widthMm / 1000
  const heightM = input.heightMm / 1000
  const sandDepthM = input.sandDepthMm / 1000
  const wasteMultiplier = 1 + input.wastePercent / 100

  const baseConcreteVolumeM3 = input.totalLengthM * widthM * heightM
  const concreteVolumeWithWasteM3 = baseConcreteVolumeM3 * wasteMultiplier
  const sandVolumeM3 = input.totalLengthM * widthM * sandDepthM * wasteMultiplier
  const formworkAreaM2 = input.totalLengthM * heightM * 2
  const rebarLengthM = input.totalLengthM * input.rebarRuns * wasteMultiplier
  const meterWeight = rebarWeightPerMeter(input.rebarDiameterMm)
  if (meterWeight === null) return null

  const rebarWeightKg = rebarLengthM * meterWeight
  const concreteCost = input.concretePricePerM3 > 0 ? concreteVolumeWithWasteM3 * input.concretePricePerM3 : null
  const rebarCost = input.rebarPricePerKg > 0 ? rebarWeightKg * input.rebarPricePerKg : null

  return {
    baseConcreteVolumeM3: roundTo(baseConcreteVolumeM3, 3),
    concreteVolumeWithWasteM3: roundTo(concreteVolumeWithWasteM3, 3),
    sandVolumeM3: roundTo(sandVolumeM3, 3),
    formworkAreaM2: roundTo(formworkAreaM2, 2),
    rebarLengthM: roundTo(rebarLengthM, 1),
    rebarWeightKg: roundTo(rebarWeightKg, 1),
    concreteCost: concreteCost === null ? null : roundTo(concreteCost, 2),
    rebarCost: rebarCost === null ? null : roundTo(rebarCost, 2),
    totalCost: concreteCost !== null || rebarCost !== null ? roundTo((concreteCost ?? 0) + (rebarCost ?? 0), 2) : null,
  }
}
