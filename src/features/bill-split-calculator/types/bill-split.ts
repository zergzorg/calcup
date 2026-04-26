export interface BillSplitInput {
  billAmount: number
  peopleCount: number
  tipPercent: number
  serviceFee: number
  roundTo: number
}

export type BillSplitInputField = keyof BillSplitInput

export interface BillSplitResult {
  billAmount: number
  tipAmount: number
  serviceFee: number
  totalAmount: number
  exactPerPerson: number
  roundedPerPerson: number
  collectedTotal: number
  roundingReserve: number
}

export interface BillSplitValidationIssue {
  field: BillSplitInputField
  messageKey: string
}
