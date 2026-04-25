import type { DrywallInput, DrywallResult } from '../types/drywall'

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

export function calculateDrywall(input: DrywallInput): DrywallResult | null {
  if (!isPositive(input.wallLength) || !isPositive(input.wallHeight)) return null
  if (!isNonNegative(input.openingsArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.sheetPrice)) return null
  if (!isPositive(input.sheetWidth) || !isPositive(input.sheetHeight) || !isPositive(input.studSpacingMm)) return null
  if (!isPositiveInteger(input.layers) || !isPositiveInteger(input.screwsPerSheet)) return null

  const grossArea = input.wallLength * input.wallHeight
  const netArea = grossArea - input.openingsArea
  if (!isPositive(netArea)) return null

  const sheetArea = input.sheetWidth * input.sheetHeight
  const materialArea = netArea * input.layers * (1 + input.wastePercent / 100)
  const sheetsNeeded = Math.ceil(materialArea / sheetArea)
  const purchaseArea = sheetsNeeded * sheetArea
  const spacingM = input.studSpacingMm / 1000
  const studsCount = Math.floor(input.wallLength / spacingM) + 1
  const guideProfileM = input.wallLength * 2
  const studProfileM = studsCount * input.wallHeight
  const screwsNeeded = sheetsNeeded * input.screwsPerSheet

  return {
    grossArea: roundTo(grossArea, 2),
    netArea: roundTo(netArea, 2),
    materialArea: roundTo(materialArea, 2),
    sheetArea: roundTo(sheetArea, 2),
    sheetsNeeded,
    purchaseArea: roundTo(purchaseArea, 2),
    leftoverArea: roundTo(purchaseArea - materialArea, 2),
    guideProfileM: roundTo(guideProfileM, 1),
    studProfileM: roundTo(studProfileM, 1),
    studsCount,
    screwsNeeded,
    totalCost: input.sheetPrice > 0 ? roundTo(sheetsNeeded * input.sheetPrice, 2) : null,
  }
}
