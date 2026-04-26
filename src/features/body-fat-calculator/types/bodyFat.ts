export type BodyFatSex = 'male' | 'female'

export type BodyFatInputField = 'heightCm' | 'neckCm' | 'waistCm' | 'hipCm'

export interface BodyFatInput {
  sex: BodyFatSex
  heightCm: number
  neckCm: number
  waistCm: number
  hipCm: number
}

export interface BodyFatResult {
  sex: BodyFatSex
  bodyFatPercent: number
  fatMassKg: number | null
  leanMassKg: number | null
  categoryKey: string
}

export interface BodyFatValidationIssue {
  field: BodyFatInputField
  messageKey: string
}
