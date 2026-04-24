export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obesity'

export type BmiInputField = 'heightCm' | 'weightKg'

export interface BmiResult {
  value: number
  category: BmiCategory
}

export interface BmiValidationIssue {
  field: BmiInputField
  messageKey: string
}
