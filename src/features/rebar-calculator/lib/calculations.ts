import { CONSTRUCTION_MATERIALS_CONFIG } from '../../../config'
import type { RebarInput, RebarResult } from '../types/rebar'

const STEEL_DENSITY_KG_M3 = CONSTRUCTION_MATERIALS_CONFIG.rebar.steelDensityKgM3

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

  const diameterM = diameterMm / 1000
  const areaM2 = Math.PI * diameterM * diameterM / 4

  return roundTo(areaM2 * STEEL_DENSITY_KG_M3, 3)
}

export function countBarsAcross(spanM: number, spacingMm: number): number | null {
  if (!isPositive(spanM) || !isPositive(spacingMm)) return null

  const spacingM = spacingMm / 1000
  return Math.floor(spanM / spacingM) + 1
}

export function calculateRebar(input: RebarInput): RebarResult | null {
  if (!isPositive(input.lengthM) || !isPositive(input.widthM)) return null
  if (!isPositive(input.spacingMm) || !isPositive(input.diameterMm) || !isPositive(input.barLengthM)) return null
  if (!isPositiveInteger(input.layers)) return null
  if (!isNonNegative(input.wastePercent) || !isNonNegative(input.pricePerKg)) return null

  const longitudinalBars = countBarsAcross(input.widthM, input.spacingMm)
  const transverseBars = countBarsAcross(input.lengthM, input.spacingMm)
  const weightPerMeterKg = rebarWeightPerMeter(input.diameterMm)
  if (longitudinalBars === null || transverseBars === null || weightPerMeterKg === null) return null

  const barsPerLayer = longitudinalBars + transverseBars
  const totalBarsInGrid = barsPerLayer * input.layers
  const baseLengthM = (longitudinalBars * input.lengthM + transverseBars * input.widthM) * input.layers
  const lengthWithWasteM = baseLengthM * (1 + input.wastePercent / 100)
  const purchaseBars = Math.ceil(lengthWithWasteM / input.barLengthM)
  const purchaseLengthM = purchaseBars * input.barLengthM
  const totalWeightKg = purchaseLengthM * weightPerMeterKg
  const totalCost = input.pricePerKg > 0 ? totalWeightKg * input.pricePerKg : null

  return {
    longitudinalBars,
    transverseBars,
    barsPerLayer,
    totalBarsInGrid,
    baseLengthM: roundTo(baseLengthM, 2),
    lengthWithWasteM: roundTo(lengthWithWasteM, 2),
    purchaseBars,
    purchaseLengthM: roundTo(purchaseLengthM, 2),
    weightPerMeterKg,
    totalWeightKg: roundTo(totalWeightKg, 1),
    totalCost: totalCost === null ? null : roundTo(totalCost, 2),
  }
}
