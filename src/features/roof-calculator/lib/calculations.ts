import type { RoofInput, RoofResult, RoofType } from '../types/roof'

const MAX_PITCH_DEGREES = 80

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

export function isValidPitch(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value < MAX_PITCH_DEGREES
}

export function slopeFactorFromPitch(pitchDegrees: number): number | null {
  if (!isValidPitch(pitchDegrees)) return null

  const radians = pitchDegrees * Math.PI / 180
  return 1 / Math.cos(radians)
}

export function calculateRidgeLength(roofType: RoofType, projectedLengthM: number, projectedWidthM: number): number | null {
  if (roofType === 'gable' || roofType === 'shed') return roundTo(projectedLengthM, 2)
  if (roofType === 'hip') return roundTo(Math.max(0, projectedLengthM - projectedWidthM), 2)
  return null
}

export function calculateRoof(input: RoofInput): RoofResult | null {
  if (!isPositive(input.lengthM) || !isPositive(input.widthM)) return null
  if (!isNonNegative(input.overhangMm) || !isValidPitch(input.pitchDegrees)) return null
  if (!isPositive(input.sheetLengthM) || !isPositive(input.sheetWidthM)) return null
  if (!isNonNegative(input.sideOverlapMm) || !isNonNegative(input.endOverlapMm)) return null
  if (!isNonNegative(input.wastePercent) || !isNonNegative(input.pricePerSheet)) return null

  const effectiveSheetWidthM = input.sheetWidthM - input.sideOverlapMm / 1000
  const effectiveSheetLengthM = input.sheetLengthM - input.endOverlapMm / 1000
  if (!isPositive(effectiveSheetWidthM) || !isPositive(effectiveSheetLengthM)) return null

  const overhangM = input.overhangMm / 1000
  const projectedLengthM = input.lengthM + overhangM * 2
  const projectedWidthM = input.widthM + overhangM * 2
  const projectedAreaM2 = projectedLengthM * projectedWidthM
  const slopeFactor = slopeFactorFromPitch(input.pitchDegrees)
  if (slopeFactor === null) return null

  const halfSpanM = input.roofType === 'shed' ? projectedWidthM : projectedWidthM / 2
  const slopeLengthM = halfSpanM * slopeFactor
  const roofAreaM2 = projectedAreaM2 * slopeFactor
  const materialAreaM2 = roofAreaM2 * (1 + input.wastePercent / 100)
  const effectiveSheetAreaM2 = effectiveSheetWidthM * effectiveSheetLengthM
  const sheetsNeeded = Math.ceil(materialAreaM2 / effectiveSheetAreaM2)
  const purchaseAreaM2 = sheetsNeeded * input.sheetLengthM * input.sheetWidthM

  return {
    projectedLengthM: roundTo(projectedLengthM, 2),
    projectedWidthM: roundTo(projectedWidthM, 2),
    projectedAreaM2: roundTo(projectedAreaM2, 2),
    slopeFactor: roundTo(slopeFactor, 3),
    slopeLengthM: roundTo(slopeLengthM, 2),
    roofAreaM2: roundTo(roofAreaM2, 2),
    materialAreaM2: roundTo(materialAreaM2, 2),
    effectiveSheetAreaM2: roundTo(effectiveSheetAreaM2, 3),
    sheetsNeeded,
    purchaseAreaM2: roundTo(purchaseAreaM2, 2),
    leftoverAreaM2: roundTo(purchaseAreaM2 - materialAreaM2, 2),
    ridgeLengthM: calculateRidgeLength(input.roofType, projectedLengthM, projectedWidthM),
    totalCost: input.pricePerSheet > 0 ? roundTo(sheetsNeeded * input.pricePerSheet, 2) : null,
  }
}
