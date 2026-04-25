import type { PaintInput, PaintResult } from '../types/paint'

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

export function isValidNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}

export function calculatePerimeter(length: number, width: number): number | null {
  if (!isValidPositiveNumber(length) || !isValidPositiveNumber(width)) return null
  return 2 * (length + width)
}

export function calculateWallArea(perimeter: number, height: number): number | null {
  if (!isValidPositiveNumber(perimeter) || !isValidPositiveNumber(height)) return null
  return perimeter * height
}

export function calculateOpeningsArea(input: Pick<
  PaintInput,
  'windowsCount' | 'windowWidth' | 'windowHeight' | 'doorsCount' | 'doorWidth' | 'doorHeight' | 'extraOpeningsArea'
>): number | null {
  if (!isValidNonNegativeInteger(input.windowsCount) || !isValidNonNegativeInteger(input.doorsCount)) {
    return null
  }
  if (
    !isValidNonNegativeNumber(input.windowWidth)
    || !isValidNonNegativeNumber(input.windowHeight)
    || !isValidNonNegativeNumber(input.doorWidth)
    || !isValidNonNegativeNumber(input.doorHeight)
    || !isValidNonNegativeNumber(input.extraOpeningsArea)
  ) {
    return null
  }

  return input.windowsCount * input.windowWidth * input.windowHeight
    + input.doorsCount * input.doorWidth * input.doorHeight
    + input.extraOpeningsArea
}

export function calculatePaintableArea(grossWallArea: number, openingsArea: number): number | null {
  if (!isValidNonNegativeNumber(grossWallArea) || !isValidNonNegativeNumber(openingsArea)) return null
  return Math.max(grossWallArea - openingsArea, 0)
}

export function calculatePaintLiters(
  paintableArea: number,
  coats: number,
  coveragePerLiter: number,
  wastePercent: number,
): { coatedArea: number; baseLiters: number; litersWithWaste: number } | null {
  if (!isValidNonNegativeNumber(paintableArea)) return null
  if (!isValidPositiveInteger(coats)) return null
  if (!isValidPositiveNumber(coveragePerLiter)) return null
  if (!isValidNonNegativeNumber(wastePercent) || wastePercent > 100) return null

  const coatedArea = paintableArea * coats
  const baseLiters = coatedArea / coveragePerLiter
  return {
    coatedArea: round2(coatedArea),
    baseLiters: round2(baseLiters),
    litersWithWaste: round2(baseLiters * (1 + wastePercent / 100)),
  }
}

export function calculatePaintCans(liters: number, canVolume: number): number | null {
  if (!isValidNonNegativeNumber(liters) || !isValidPositiveNumber(canVolume)) return null
  return Math.ceil(liters / canVolume)
}

export function calculatePaint(input: PaintInput): PaintResult | null {
  if (!isValidPositiveNumber(input.roomLength)) return null
  if (!isValidPositiveNumber(input.roomWidth)) return null
  if (!isValidPositiveNumber(input.wallHeight)) return null
  if (!isValidPositiveInteger(input.coats)) return null
  if (!isValidPositiveNumber(input.coveragePerLiter)) return null
  if (!isValidNonNegativeNumber(input.wastePercent) || input.wastePercent > 100) return null
  if (!isValidPositiveNumber(input.canVolume)) return null
  if (!isValidNonNegativeNumber(input.canPrice)) return null

  const perimeter = calculatePerimeter(input.roomLength, input.roomWidth)
  if (perimeter === null) return null

  const grossWallArea = calculateWallArea(perimeter, input.wallHeight)
  const openingsArea = calculateOpeningsArea(input)
  if (grossWallArea === null || openingsArea === null) return null

  const paintableArea = calculatePaintableArea(grossWallArea, openingsArea)
  if (paintableArea === null) return null

  const liters = calculatePaintLiters(
    paintableArea,
    input.coats,
    input.coveragePerLiter,
    input.wastePercent,
  )
  if (liters === null) return null

  const cansNeeded = calculatePaintCans(liters.litersWithWaste, input.canVolume)
  if (cansNeeded === null) return null

  const purchaseVolume = round2(cansNeeded * input.canVolume)

  return {
    perimeter: round2(perimeter),
    grossWallArea: round2(grossWallArea),
    openingsArea: round2(openingsArea),
    paintableArea: round2(paintableArea),
    coatedArea: liters.coatedArea,
    baseLiters: liters.baseLiters,
    litersWithWaste: liters.litersWithWaste,
    cansNeeded,
    purchaseVolume,
    leftoverLiters: round2(Math.max(purchaseVolume - liters.litersWithWaste, 0)),
    totalCost: input.canPrice > 0 ? round2(cansNeeded * input.canPrice) : null,
    openingsExceedWalls: openingsArea > grossWallArea,
  }
}
