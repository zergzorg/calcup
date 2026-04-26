export type DogSize = 'small' | 'medium' | 'large' | 'giant'
export type DogAgeInputField = 'years' | 'months'

export interface DogAgeInput {
  years: number
  months: number
  size: DogSize
}

export interface DogAgeResult {
  totalMonths: number
  dogYears: number
  humanYears: number
  stageKey: string
  yearlyAgingRate: number
}

export interface DogAgeValidationIssue {
  field: DogAgeInputField
  messageKey: string
}
