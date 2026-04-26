export interface AgeInput {
  birthDate: string
  targetDate: string
  milestoneValue: number
  milestoneUnit: AgeMilestoneUnit
}

export type AgeInputField = keyof AgeInput
export type AgeMilestoneUnit = 'days' | 'weeks' | 'months' | 'years'

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
  milestone: AgeMilestoneResult | null
  upcomingMilestones: AgeUpcomingMilestone[]
}

export interface AgeValidationIssue {
  field: AgeInputField
  messageKey: string
}

export interface AgeMilestoneInput {
  value: number
  unit: AgeMilestoneUnit
}

export interface AgeMilestoneResult {
  value: number
  unit: AgeMilestoneUnit
  date: DateOnly
  age: AgeBreakdown
  daysFromTarget: number
  isPast: boolean
}

export interface AgeUpcomingMilestone {
  value: number
  unit: AgeMilestoneUnit
  date: DateOnly
  daysUntil: number
}
