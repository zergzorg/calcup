export type CatAgeInputField = 'years' | 'months'

export interface CatAgeInput {
  years: number
  months: number
}

export interface CatAgeResult {
  totalMonths: number
  catYears: number
  humanYears: number
  stageKey: string
}

export interface CatAgeValidationIssue {
  field: CatAgeInputField
  messageKey: string
}
