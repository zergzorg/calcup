export type PercentageMode = 'percentOf' | 'partOfTotal' | 'adjustByPercent' | 'percentageChange'

export type AdjustmentDirection = 'increase' | 'decrease'

export type PercentageInputField = 'percent' | 'base' | 'part' | 'total' | 'oldValue' | 'newValue'

export interface PercentageResult {
  value: number
  unit: 'number' | 'percent'
}

export interface PercentageValidationIssue {
  field: PercentageInputField
  messageKey: string
}
