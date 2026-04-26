export interface SelfEmployedTaxInput {
  individualIncome: number
  businessIncome: number
  bonusBalance: number
}

export interface SelfEmployedTaxResult {
  totalIncome: number
  individualTax: number
  businessTax: number
  taxBeforeBonus: number
  bonusUsed: number
  taxToPay: number
  netIncome: number
  annualLimit: number
  remainingLimit: number
  limitExceededBy: number
}

export interface SelfEmployedTaxValidationIssue {
  field: keyof SelfEmployedTaxInput
  messageKey: string
}
