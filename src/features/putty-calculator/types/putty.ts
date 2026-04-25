export interface PuttyInput {
  surfaceArea: number
  excludedArea: number
  layerThicknessMm: number
  consumptionKgPerM2Mm: number
  wastePercent: number
  bagWeightKg: number
  bagPrice: number
}

export interface PuttyResult {
  grossArea: number
  netArea: number
  mixKg: number
  bagsNeeded: number
  purchaseKg: number
  leftoverKg: number
  totalCost: number | null
}

export type PuttyInputField = keyof PuttyInput

export interface PuttyValidationIssue {
  field: PuttyInputField
  messageKey: string
}
