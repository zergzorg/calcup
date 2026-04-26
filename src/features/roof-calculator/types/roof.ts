export type RoofType = 'gable' | 'hip' | 'shed'

export interface RoofInput {
  roofType: RoofType
  lengthM: number
  widthM: number
  overhangMm: number
  pitchDegrees: number
  sheetLengthM: number
  sheetWidthM: number
  sideOverlapMm: number
  endOverlapMm: number
  wastePercent: number
  pricePerSheet: number
}

export type RoofInputField = Exclude<keyof RoofInput, 'roofType'>

export interface RoofResult {
  projectedLengthM: number
  projectedWidthM: number
  projectedAreaM2: number
  slopeFactor: number
  slopeLengthM: number
  roofAreaM2: number
  materialAreaM2: number
  effectiveSheetAreaM2: number
  sheetsNeeded: number
  purchaseAreaM2: number
  leftoverAreaM2: number
  ridgeLengthM: number | null
  totalCost: number | null
}

export interface RoofValidationIssue {
  field: keyof RoofInput
  messageKey: string
}
