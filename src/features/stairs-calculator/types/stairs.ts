export interface StairsInput {
  totalRiseCm: number
  targetRiserCm: number
  treadDepthCm: number
  stairWidthM: number
  wastePercent: number
  pricePerTread: number
}

export type StairsInputField = keyof StairsInput

export type StairsComfort = 'low' | 'comfortable' | 'steep'

export interface StairsResult {
  risersCount: number
  treadsCount: number
  actualRiserCm: number
  treadDepthCm: number
  totalRunCm: number
  stairAngleDegrees: number
  stringerLengthM: number
  treadAreaM2: number
  treadAreaWithWasteM2: number
  purchaseTreads: number
  comfortStepCm: number
  comfort: StairsComfort
  totalCost: number | null
}

export interface StairsValidationIssue {
  field: StairsInputField
  messageKey: string
}
