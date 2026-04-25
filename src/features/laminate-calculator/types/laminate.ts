export interface LaminateInput {
  roomLength: number
  roomWidth: number
  excludedArea: number
  wastePercent: number
  packCoverage: number
  packPrice: number
}

export interface LaminateResult {
  grossArea: number
  netArea: number
  materialArea: number
  packsNeeded: number
  purchaseArea: number
  leftoverArea: number
  totalCost: number | null
}

export type LaminateInputField = keyof LaminateInput

export interface LaminateValidationIssue {
  field: LaminateInputField
  messageKey: string
}
