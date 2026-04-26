import type { RoomAreaInput, RoomAreaResult } from '../types/room-area'

export function calculateRoomArea(input: RoomAreaInput): RoomAreaResult | null {
  if (!isPositive(input.lengthM) || !isPositive(input.widthM) || !isPositive(input.heightM)) {
    return null
  }

  if (
    !isNonNegativeInteger(input.windowsCount)
    || !isNonNegative(input.windowWidthM)
    || !isNonNegative(input.windowHeightM)
    || !isNonNegativeInteger(input.doorsCount)
    || !isNonNegative(input.doorWidthM)
    || !isNonNegative(input.doorHeightM)
    || !isNonNegative(input.extraOpeningsAreaM2)
  ) {
    return null
  }

  const floorAreaM2 = input.lengthM * input.widthM
  const perimeterM = 2 * (input.lengthM + input.widthM)
  const grossWallAreaM2 = perimeterM * input.heightM
  const windowsAreaM2 = input.windowsCount * input.windowWidthM * input.windowHeightM
  const doorsAreaM2 = input.doorsCount * input.doorWidthM * input.doorHeightM
  const openingsAreaM2 = windowsAreaM2 + doorsAreaM2 + input.extraOpeningsAreaM2
  const finishWallAreaM2 = Math.max(0, grossWallAreaM2 - openingsAreaM2)

  return {
    floorAreaM2,
    ceilingAreaM2: floorAreaM2,
    perimeterM,
    grossWallAreaM2,
    openingsAreaM2,
    finishWallAreaM2,
    baseboardLengthM: perimeterM,
  }
}

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}
