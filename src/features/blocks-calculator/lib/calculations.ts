import type { BlocksInput, BlocksResult } from '../types/blocks'

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

export function calculateBlocks(input: BlocksInput): BlocksResult | null {
  if (!isPositive(input.wallLength) || !isPositive(input.wallHeight)) return null
  if (!isNonNegative(input.openingsArea) || !isNonNegative(input.wastePercent) || !isNonNegative(input.blockPrice)) return null
  if (!isPositive(input.blockLengthMm) || !isPositive(input.blockHeightMm) || !isPositive(input.blockWidthMm)) return null
  if (!isNonNegative(input.adhesiveKgPerM2) || !isPositive(input.bagWeightKg)) return null

  const grossArea = input.wallLength * input.wallHeight
  const netArea = grossArea - input.openingsArea
  if (!isPositive(netArea)) return null

  const blockLengthM = input.blockLengthMm / 1000
  const blockHeightM = input.blockHeightMm / 1000
  const blockWidthM = input.blockWidthMm / 1000
  const blockFaceArea = blockLengthM * blockHeightM
  const blockVolume = blockFaceArea * blockWidthM
  if (!isPositive(blockFaceArea) || !isPositive(blockVolume)) return null

  const baseBlocks = Math.ceil(netArea / blockFaceArea)
  const blocksWithWaste = Math.ceil(baseBlocks * (1 + input.wastePercent / 100))
  const wallVolume = netArea * blockWidthM
  const adhesiveKg = netArea * input.adhesiveKgPerM2
  const adhesiveBags = input.adhesiveKgPerM2 > 0 ? Math.ceil(adhesiveKg / input.bagWeightKg) : 0

  return {
    grossArea: roundTo(grossArea, 2),
    netArea: roundTo(netArea, 2),
    blockFaceArea: roundTo(blockFaceArea, 3),
    blockVolume: roundTo(blockVolume, 3),
    wallVolume: roundTo(wallVolume, 2),
    baseBlocks,
    blocksWithWaste,
    adhesiveKg: roundTo(adhesiveKg, 1),
    adhesiveBags,
    totalCost: input.blockPrice > 0 ? roundTo(blocksWithWaste * input.blockPrice, 2) : null,
  }
}
