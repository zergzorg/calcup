export interface FloorScreedInput {
  roomLength: number
  roomWidth: number
  excludedArea: number
  thicknessMm: number
  consumptionKgPerM2Mm: number
  wastePercent: number
  bagWeight: number
  bagPrice: number
}

export interface FloorScreedResult {
  grossArea: number
  netArea: number
  volumeM3: number
  dryMixKg: number
  bagsNeeded: number
  purchaseKg: number
  leftoverKg: number
  totalCost: number | null
}

export type FloorScreedInputField = keyof FloorScreedInput

export interface FloorScreedValidationIssue {
  field: FloorScreedInputField
  messageKey: string
}
