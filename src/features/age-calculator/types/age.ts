export interface AgeInput {
  birthDate: string
  targetDate: string
}

export type AgeInputField = keyof AgeInput

export interface DateOnly {
  year: number
  month: number
  day: number
}

export interface AgeBreakdown {
  years: number
  months: number
  days: number
}

export interface AgeResult {
  age: AgeBreakdown
  totalDays: number
  totalWeeks: number
  totalMonths: number
  nextBirthday: DateOnly
  daysUntilBirthday: number
  nextBirthdayAge: number
}

export interface AgeValidationIssue {
  field: AgeInputField
  messageKey: string
}
