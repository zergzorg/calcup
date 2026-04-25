import type { TileInput, TileResult } from '../types/tile'

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

export function calculateTile(input: TileInput): TileResult | null {
  if (!isPositive(input.surfaceLength) || !isPositive(input.surfaceWidth)) return null
  if (!isPositive(input.tileLengthCm) || !isPositive(input.tileWidthCm)) return null
  if (!Number.isInteger(input.tilesPerBox) || input.tilesPerBox <= 0) return null
  if (!isNonNegative(input.wastePercent) || !isNonNegative(input.boxPrice)) return null

  const surfaceArea = input.surfaceLength * input.surfaceWidth
  const tileArea = (input.tileLengthCm / 100) * (input.tileWidthCm / 100)
  if (!isPositive(tileArea)) return null

  const baseTiles = Math.ceil(surfaceArea / tileArea)
  const tilesWithWaste = Math.ceil(baseTiles * (1 + input.wastePercent / 100))
  const boxesNeeded = Math.ceil(tilesWithWaste / input.tilesPerBox)
  const purchaseTiles = boxesNeeded * input.tilesPerBox

  return {
    surfaceArea: roundTo(surfaceArea, 2),
    tileArea: roundTo(tileArea, 4),
    baseTiles,
    tilesWithWaste,
    boxesNeeded,
    purchaseTiles,
    leftoverTiles: purchaseTiles - tilesWithWaste,
    totalCost: input.boxPrice > 0 ? roundTo(boxesNeeded * input.boxPrice, 2) : null,
  }
}
