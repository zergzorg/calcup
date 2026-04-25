import type { WallpaperInput, WallpaperResult } from '../types/wallpaper'

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
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
  WallpaperInput,
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

export function calculateNetWallArea(grossWallArea: number, openingsArea: number): number | null {
  if (!isValidNonNegativeNumber(grossWallArea) || !isValidNonNegativeNumber(openingsArea)) return null
  return Math.max(grossWallArea - openingsArea, 0)
}

export function applyWaste(area: number, wastePercent: number): number | null {
  if (!isValidNonNegativeNumber(area) || !isValidNonNegativeNumber(wastePercent) || wastePercent > 100) {
    return null
  }
  return area * (1 + wastePercent / 100)
}

export function calculateAdjustedStripHeight(
  wallHeight: number,
  usePatternRepeat: boolean,
  patternRepeat: number,
): number | null {
  if (!isValidPositiveNumber(wallHeight)) return null
  if (!usePatternRepeat) return wallHeight
  if (!isValidPositiveNumber(patternRepeat)) return null
  return Math.ceil(wallHeight / patternRepeat) * patternRepeat
}

export function calculateStripsNeeded(perimeter: number, rollWidth: number): number | null {
  if (!isValidPositiveNumber(perimeter) || !isValidPositiveNumber(rollWidth)) return null
  return Math.ceil(perimeter / rollWidth)
}

export function calculateStripsPerRoll(rollLength: number, stripHeight: number): number | null {
  if (!isValidPositiveNumber(rollLength) || !isValidPositiveNumber(stripHeight)) return null
  return Math.floor(rollLength / stripHeight)
}

export function calculateRollsByArea(areaWithWaste: number, rollArea: number): number | null {
  if (!isValidNonNegativeNumber(areaWithWaste) || !isValidPositiveNumber(rollArea)) return null
  return Math.ceil(areaWithWaste / rollArea)
}

export function calculateRollsByStrips(stripsNeeded: number, stripsPerRoll: number): number | null {
  if (!isValidNonNegativeNumber(stripsNeeded) || !isValidPositiveNumber(stripsPerRoll)) return null
  return Math.ceil(stripsNeeded / stripsPerRoll)
}

export function calculateWallpaper(input: WallpaperInput): WallpaperResult | null {
  if (!isValidPositiveNumber(input.roomLength)) return null
  if (!isValidPositiveNumber(input.roomWidth)) return null
  if (!isValidPositiveNumber(input.wallHeight)) return null
  if (!isValidPositiveNumber(input.rollWidth)) return null
  if (!isValidPositiveNumber(input.rollLength)) return null
  if (!isValidNonNegativeNumber(input.wastePercent) || input.wastePercent > 100) return null
  if (!isValidNonNegativeNumber(input.rollPrice)) return null
  if (input.usePatternRepeat && !isValidPositiveNumber(input.patternRepeat)) return null

  const perimeter = calculatePerimeter(input.roomLength, input.roomWidth)
  if (perimeter === null) return null

  const grossWallArea = calculateWallArea(perimeter, input.wallHeight)
  const openingsArea = calculateOpeningsArea(input)
  if (grossWallArea === null || openingsArea === null) return null

  const netWallArea = calculateNetWallArea(grossWallArea, openingsArea)
  if (netWallArea === null) return null

  const areaWithWaste = applyWaste(netWallArea, input.wastePercent)
  if (areaWithWaste === null) return null

  const rollArea = input.rollWidth * input.rollLength
  if (!isValidPositiveNumber(rollArea)) return null

  const adjustedStripHeight = calculateAdjustedStripHeight(
    input.wallHeight,
    input.usePatternRepeat,
    input.patternRepeat,
  )
  if (adjustedStripHeight === null) return null

  const stripsNeeded = calculateStripsNeeded(perimeter, input.rollWidth)
  const stripsPerRoll = calculateStripsPerRoll(input.rollLength, adjustedStripHeight)
  const rollsByArea = calculateRollsByArea(areaWithWaste, rollArea)
  if (stripsNeeded === null || stripsPerRoll === null || rollsByArea === null) return null
  if (stripsPerRoll < 1) return null

  const rollsByStrips = calculateRollsByStrips(stripsNeeded, stripsPerRoll)
  if (rollsByStrips === null) return null

  const recommendedRolls = Math.max(rollsByArea, rollsByStrips)
  const windowsArea = input.windowsCount * input.windowWidth * input.windowHeight
  const doorsArea = input.doorsCount * input.doorWidth * input.doorHeight

  return {
    perimeter,
    grossWallArea,
    windowsArea,
    doorsArea,
    openingsArea,
    netWallArea,
    areaWithWaste,
    rollArea,
    stripHeight: input.wallHeight,
    adjustedStripHeight,
    stripsNeeded,
    stripsPerRoll,
    rollsByArea,
    rollsByStrips,
    recommendedRolls,
    totalCost: input.rollPrice > 0 ? recommendedRolls * input.rollPrice : null,
    openingsExceedWalls: openingsArea > grossWallArea,
    calculationBasis: rollsByStrips >= rollsByArea ? 'strips' : 'area',
  }
}
