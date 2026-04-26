export type SickLeaveExperience = 'under5' | 'from5to8' | 'over8'

export interface SickLeaveInput {
  income2024: number
  income2025: number
  sickDays: number
  experience: SickLeaveExperience
  taxPercent: number
}

export interface SickLeaveResult {
  totalIncome: number
  rawAverageDaily: number
  dailyBenefit: number
  grossBenefit: number
  taxAmount: number
  netBenefit: number
  employerGross: number
  fundGross: number
  employerDays: number
  fundDays: number
  experienceRate: number
}

export interface SickLeaveValidationIssue {
  field: keyof SickLeaveInput
  messageKey: string
}
