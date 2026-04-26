export type FractionOperator = 'add' | 'subtract' | 'multiply' | 'divide'

export type FractionInputField =
  | 'leftNumerator'
  | 'leftDenominator'
  | 'rightNumerator'
  | 'rightDenominator'

export interface FractionValue {
  numerator: number
  denominator: number
}

export interface MixedFraction {
  sign: -1 | 1
  whole: number
  numerator: number
  denominator: number
}

export interface FractionCalculationResult {
  fraction: FractionValue
  decimal: number
  mixed: MixedFraction | null
}

export interface FractionValidationIssue {
  field: FractionInputField
  messageKey: string
}
