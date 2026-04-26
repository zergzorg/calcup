export type DepositInterestMode = 'simple' | 'monthlyCapitalization'

export type DepositInputField = 'initialAmount' | 'annualRate' | 'termMonths'

export interface DepositInput {
  initialAmount: number
  annualRate: number
  termMonths: number
  mode: DepositInterestMode
}

export interface DepositResult {
  initialAmount: number
  annualRate: number
  termMonths: number
  mode: DepositInterestMode
  income: number
  finalAmount: number
  effectiveGrowthPercent: number
}

export interface DepositValidationIssue {
  field: DepositInputField
  messageKey: string
}
