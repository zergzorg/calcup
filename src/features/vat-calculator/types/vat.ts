export type VatMode = 'add' | 'extract'

export type VatPresetRate = 22 | 10 | 7 | 5 | 0

export interface VatAddResult {
  vatAmount: number
  amountWithVat: number
}

export interface VatExtractResult {
  vatAmount: number
  amountWithoutVat: number
}

export interface VatValidationIssue {
  field: 'amount' | 'rate'
  messageKey: string
}
