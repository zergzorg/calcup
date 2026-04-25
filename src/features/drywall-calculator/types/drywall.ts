export interface DrywallInput {
  wallLength: number
  wallHeight: number
  openingsArea: number
  sheetWidth: number
  sheetHeight: number
  layers: number
  wastePercent: number
  studSpacingMm: number
  screwsPerSheet: number
  sheetPrice: number
}

export interface DrywallResult {
  grossArea: number
  netArea: number
  materialArea: number
  sheetArea: number
  sheetsNeeded: number
  purchaseArea: number
  leftoverArea: number
  guideProfileM: number
  studProfileM: number
  studsCount: number
  screwsNeeded: number
  totalCost: number | null
}

export type DrywallInputField = keyof DrywallInput

export interface DrywallValidationIssue {
  field: DrywallInputField
  messageKey: string
}
