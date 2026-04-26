export type MortgageInputField =
  | 'propertyPrice'
  | 'downPaymentPercent'
  | 'annualRate'
  | 'termYears'
  | 'additionalContribution'
  | 'monthlyCosts'
  | 'oneTimeFees'
  | 'earlyPayment'
  | 'extraMonthlyPayment'

export interface MortgageInput {
  propertyPrice: number
  downPaymentPercent: number
  annualRate: number
  termYears: number
  additionalContribution: number
  monthlyCosts: number
  oneTimeFees: number
  earlyPayment: number
  extraMonthlyPayment: number
}

export interface MortgageScheduleRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResult {
  propertyPrice: number
  downPaymentAmount: number
  additionalContribution: number
  principal: number
  termMonths: number
  monthlyPayment: number
  monthlyCashOut: number
  totalPayment: number
  totalCashOut: number
  overpayment: number
  baseOverpayment: number
  savedInterest: number
  actualTermMonths: number
  oneTimeFees: number
  earlyPayment: number
  extraMonthlyPayment: number
  loanToValuePercent: number
  schedulePreview: MortgageScheduleRow[]
}

export interface MortgageValidationIssue {
  field: MortgageInputField
  messageKey: string
}
