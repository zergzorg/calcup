export interface RebarInput {
  lengthM: number
  widthM: number
  spacingMm: number
  layers: number
  diameterMm: number
  barLengthM: number
  wastePercent: number
  pricePerKg: number
}

export interface RebarResult {
  longitudinalBars: number
  transverseBars: number
  barsPerLayer: number
  totalBarsInGrid: number
  baseLengthM: number
  lengthWithWasteM: number
  purchaseBars: number
  purchaseLengthM: number
  weightPerMeterKg: number
  totalWeightKg: number
  totalCost: number | null
}

export type RebarInputField = keyof RebarInput

export interface RebarValidationIssue {
  field: RebarInputField
  messageKey: string
}
