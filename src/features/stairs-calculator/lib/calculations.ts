import type { StairsComfort, StairsInput, StairsResult } from '../types/stairs'

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

export function classifyComfort(comfortStepCm: number): StairsComfort {
  if (comfortStepCm < 60) return 'low'
  if (comfortStepCm > 64) return 'steep'
  return 'comfortable'
}

export function calculateStairs(input: StairsInput): StairsResult | null {
  if (!isPositive(input.totalRiseCm) || !isPositive(input.targetRiserCm) || !isPositive(input.treadDepthCm)) return null
  if (!isPositive(input.stairWidthM)) return null
  if (!isNonNegative(input.wastePercent) || !isNonNegative(input.pricePerTread)) return null

  const risersCount = Math.ceil(input.totalRiseCm / input.targetRiserCm)
  if (risersCount < 2) return null

  const treadsCount = Math.max(1, risersCount - 1)
  const actualRiserCm = input.totalRiseCm / risersCount
  const totalRunCm = treadsCount * input.treadDepthCm
  const stairAngleDegrees = Math.atan(input.totalRiseCm / totalRunCm) * 180 / Math.PI
  const stringerLengthM = Math.hypot(input.totalRiseCm, totalRunCm) / 100
  const treadAreaM2 = treadsCount * (input.treadDepthCm / 100) * input.stairWidthM
  const treadAreaWithWasteM2 = treadAreaM2 * (1 + input.wastePercent / 100)
  const purchaseTreads = Math.ceil(treadsCount * (1 + input.wastePercent / 100))
  const comfortStepCm = actualRiserCm * 2 + input.treadDepthCm

  return {
    risersCount,
    treadsCount,
    actualRiserCm: roundTo(actualRiserCm, 1),
    treadDepthCm: roundTo(input.treadDepthCm, 1),
    totalRunCm: roundTo(totalRunCm, 1),
    stairAngleDegrees: roundTo(stairAngleDegrees, 1),
    stringerLengthM: roundTo(stringerLengthM, 2),
    treadAreaM2: roundTo(treadAreaM2, 2),
    treadAreaWithWasteM2: roundTo(treadAreaWithWasteM2, 2),
    purchaseTreads,
    comfortStepCm: roundTo(comfortStepCm, 1),
    comfort: classifyComfort(comfortStepCm),
    totalCost: input.pricePerTread > 0 ? roundTo(purchaseTreads * input.pricePerTread, 2) : null,
  }
}
