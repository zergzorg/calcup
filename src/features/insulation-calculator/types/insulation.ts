export interface InsulationInput {
  surfaceArea: number
  excludedArea: number
  boardLengthM: number
  boardWidthM: number
  boardThicknessMm: number
  boardsPerPack: number
  wastePercent: number
  packPrice: number
}

export interface InsulationResult {
  grossArea: number
  netArea: number
  boardArea: number
  materialArea: number
  boardsNeeded: number
  packsNeeded: number
  purchaseArea: number
  leftoverArea: number
  insulationVolume: number
  purchaseVolume: number
  totalCost: number | null
}

export type InsulationInputField = keyof InsulationInput

export interface InsulationValidationIssue {
  field: InsulationInputField
  messageKey: string
}
