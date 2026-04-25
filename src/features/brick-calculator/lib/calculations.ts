import type { BrickInput, BrickResult } from '../types/brick'

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

export function calculateBrick(input: BrickInput): BrickResult | null {
  if (!isPositive(input.wallLength) || !isPositive(input.wallHeight)) return null
  if (!isNonNegative(input.openingsArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.brickPrice)) return null
  if (!isPositive(input.brickLengthMm) || !isPositive(input.brickWidthMm) || !isPositive(input.brickHeightMm)) return null
  if (!isNonNegative(input.jointMm) || !isPositive(input.thicknessBricks) || !isNonNegative(input.mortarSharePercent)) return null

  const grossArea = input.wallLength * input.wallHeight
  const netArea = grossArea - input.openingsArea
  if (!isPositive(netArea)) return null

  const faceLengthM = (input.brickLengthMm + input.jointMm) / 1000
  const faceHeightM = (input.brickHeightMm + input.jointMm) / 1000
  const brickFaceArea = faceLengthM * faceHeightM
  if (!isPositive(brickFaceArea)) return null

  const bricksPerM2HalfBrick = 1 / brickFaceArea
  const baseBricks = Math.ceil(netArea * bricksPerM2HalfBrick * input.thicknessBricks)
  const bricksWithWaste = Math.ceil(baseBricks * (1 + input.wastePercent / 100))
  const wallThicknessM = input.brickWidthMm / 1000 * input.thicknessBricks * 2
  const masonryVolume = netArea * wallThicknessM
  const mortarVolume = masonryVolume * input.mortarSharePercent / 100

  return {
    grossArea: roundTo(grossArea, 2),
    netArea: roundTo(netArea, 2),
    bricksPerM2HalfBrick: roundTo(bricksPerM2HalfBrick, 1),
    baseBricks,
    bricksWithWaste,
    masonryVolume: roundTo(masonryVolume, 2),
    mortarVolume: roundTo(mortarVolume, 2),
    totalCost: input.brickPrice > 0 ? roundTo(bricksWithWaste * input.brickPrice, 2) : null,
  }
}
