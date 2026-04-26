export type MortgageInputField = 'propertyPrice' | 'downPaymentPercent' | 'annualRate' | 'termYears'

export interface MortgageInput {
  propertyPrice: number
  downPaymentPercent: number
  annualRate: number
  termYears: number
}

export interface MortgageResult {
  propertyPrice: number
  downPaymentAmount: number
  principal: number
  termMonths: number
  monthlyPayment: number
  totalPayment: number
  overpayment: number
  loanToValuePercent: number
}

export interface MortgageValidationIssue {
  field: MortgageInputField
  messageKey: string
}
