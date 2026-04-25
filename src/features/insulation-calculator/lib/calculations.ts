import type { InsulationInput, InsulationResult } from '../types/insulation'

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

export function calculateInsulation(input: InsulationInput): InsulationResult | null {
  if (!isPositive(input.surfaceArea) || !isPositive(input.boardLengthM) || !isPositive(input.boardWidthM)) return null
  if (!isPositive(input.boardThicknessMm) || !isPositiveInteger(input.boardsPerPack)) return null
  if (!isNonNegative(input.excludedArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.packPrice)) return null
  if (input.excludedArea >= input.surfaceArea) return null

  const netArea = input.surfaceArea - input.excludedArea
  const boardArea = input.boardLengthM * input.boardWidthM
  if (!isPositive(boardArea)) return null

  const materialArea = netArea * (1 + input.wastePercent / 100)
  const boardsNeeded = Math.ceil(materialArea / boardArea)
  const packsNeeded = Math.ceil(boardsNeeded / input.boardsPerPack)
  const purchaseBoards = packsNeeded * input.boardsPerPack
  const purchaseArea = purchaseBoards * boardArea
  const thicknessM = input.boardThicknessMm / 1000

  return {
    grossArea: roundTo(input.surfaceArea, 2),
    netArea: roundTo(netArea, 2),
    boardArea: roundTo(boardArea, 3),
    materialArea: roundTo(materialArea, 2),
    boardsNeeded,
    packsNeeded,
    purchaseArea: roundTo(purchaseArea, 2),
    leftoverArea: roundTo(purchaseArea - materialArea, 2),
    insulationVolume: roundTo(materialArea * thicknessM, 3),
    purchaseVolume: roundTo(purchaseArea * thicknessM, 3),
    totalCost: input.packPrice > 0 ? roundTo(packsNeeded * input.packPrice, 2) : null,
  }
}
