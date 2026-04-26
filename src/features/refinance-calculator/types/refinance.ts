export type RefinanceInputField =
  | 'outstandingBalance'
  | 'oldAnnualRate'
  | 'oldTermMonths'
  | 'newAnnualRate'
  | 'newTermMonths'
  | 'refinancingCost'

export interface RefinanceInput {
  outstandingBalance: number
  oldAnnualRate: number
  oldTermMonths: number
  newAnnualRate: number
  newTermMonths: number
  refinancingCost: number
}

export interface RefinanceResult {
  outstandingBalance: number
  oldMonthlyPayment: number
  newMonthlyPayment: number
  oldTotalPayment: number
  newTotalPayment: number
  totalSavings: number
  monthlySavings: number
  paybackMonths: number | null
  isBeneficial: boolean
}

export interface RefinanceValidationIssue {
  field: RefinanceInputField
  messageKey: string
}
