import type { SlabFoundationInput, SlabFoundationResult } from '../types/slab-foundation'

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

export function countBarsAcross(spanM: number, spacingMm: number): number | null {
  if (!isPositive(spanM) || !isPositive(spacingMm)) return null

  return Math.floor(spanM / (spacingMm / 1000)) + 1
}

export function calculateSlabFoundation(input: SlabFoundationInput): SlabFoundationResult | null {
  if (!isPositive(input.lengthM) || !isPositive(input.widthM) || !isPositive(input.thicknessMm)) return null
  if (!isNonNegative(input.sandDepthMm) || !isNonNegative(input.gravelDepthMm) || !isNonNegative(input.wastePercent)) return null
  if (!isPositive(input.rebarSpacingMm) || !isPositive(input.rebarDiameterMm) || !isPositiveInteger(input.rebarLayers)) return null
  if (!isNonNegative(input.concretePricePerM3) || !isNonNegative(input.rebarPricePerKg)) return null

  const areaM2 = input.lengthM * input.widthM
  const wasteMultiplier = 1 + input.wastePercent / 100
  const baseConcreteVolumeM3 = areaM2 * input.thicknessMm / 1000
  const concreteVolumeWithWasteM3 = baseConcreteVolumeM3 * wasteMultiplier
  const sandVolumeM3 = areaM2 * input.sandDepthMm / 1000 * wasteMultiplier
  const gravelVolumeM3 = areaM2 * input.gravelDepthMm / 1000 * wasteMultiplier
  const longitudinalBars = countBarsAcross(input.widthM, input.rebarSpacingMm)
  const transverseBars = countBarsAcross(input.lengthM, input.rebarSpacingMm)
  const weightPerMeterKg = rebarWeightPerMeter(input.rebarDiameterMm)

  if (longitudinalBars === null || transverseBars === null || weightPerMeterKg === null) return null

  const barsPerLayer = longitudinalBars + transverseBars
  const totalBarsInGrid = barsPerLayer * input.rebarLayers
  const baseRebarLengthM = (longitudinalBars * input.lengthM + transverseBars * input.widthM) * input.rebarLayers
  const rebarLengthM = baseRebarLengthM * wasteMultiplier
  const rebarWeightKg = rebarLengthM * weightPerMeterKg
  const concreteCost = input.concretePricePerM3 > 0 ? concreteVolumeWithWasteM3 * input.concretePricePerM3 : null
  const rebarCost = input.rebarPricePerKg > 0 ? rebarWeightKg * input.rebarPricePerKg : null

  return {
    areaM2: roundTo(areaM2, 2),
    baseConcreteVolumeM3: roundTo(baseConcreteVolumeM3, 3),
    concreteVolumeWithWasteM3: roundTo(concreteVolumeWithWasteM3, 3),
    sandVolumeM3: roundTo(sandVolumeM3, 3),
    gravelVolumeM3: roundTo(gravelVolumeM3, 3),
    longitudinalBars,
    transverseBars,
    barsPerLayer,
    totalBarsInGrid,
    rebarLengthM: roundTo(rebarLengthM, 1),
    rebarWeightKg: roundTo(rebarWeightKg, 1),
    concreteCost: concreteCost === null ? null : roundTo(concreteCost, 2),
    rebarCost: rebarCost === null ? null : roundTo(rebarCost, 2),
    totalCost: concreteCost !== null || rebarCost !== null ? roundTo((concreteCost ?? 0) + (rebarCost ?? 0), 2) : null,
  }
}
