export type CurrencyCode = 'RUB' | 'USD' | 'EUR' | 'CNY'

export interface CurrencyPresetPair {
  id: string
  from: CurrencyCode
  to: CurrencyCode
  rate: number
}

export interface CurrencyConversionResult {
  converted: number
  rate: number
}

export interface CurrencyValidationIssue {
  field: 'amount' | 'rate'
  messageKey: string
}
