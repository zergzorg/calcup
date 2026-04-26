export type IdealWeightSex = 'male' | 'female'

export type IdealWeightFormula = 'devine' | 'robinson' | 'miller' | 'hamwi'

export type IdealWeightInputField = 'heightCm'

export interface IdealWeightFormulaResult {
  formula: IdealWeightFormula
  weightKg: number
}

export interface IdealWeightResult {
  recommendedKg: number
  minFormulaKg: number
  maxFormulaKg: number
  bmiMinKg: number
  bmiMaxKg: number
  formulas: IdealWeightFormulaResult[]
}

export interface IdealWeightValidationIssue {
  field: IdealWeightInputField
  messageKey: string
}
