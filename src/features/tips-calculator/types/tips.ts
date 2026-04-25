export type TipPresetRate = 0 | 5 | 10 | 15 | 20

export interface TipResult {
  tipAmount: number
  totalAmount: number
  amountPerPerson: number
  tipPerPerson: number
  billPerPerson: number
}

export interface TipValidationIssue {
  field: 'billAmount' | 'tipPercent' | 'peopleCount'
  messageKey: string
}
