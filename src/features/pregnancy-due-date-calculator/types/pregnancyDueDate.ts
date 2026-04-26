export type PregnancyDueDateMode = 'lmp' | 'conception'

export type PregnancyDueDateInputField = 'lmpDate' | 'conceptionDate' | 'todayDate'

export type PregnancyTrimester = 'first' | 'second' | 'third'

export type PregnancyTimelineStatus = 'beforeStart' | 'inProgress' | 'dueToday' | 'pastDue'

export interface DateOnly {
  year: number
  month: number
  day: number
}

export interface PregnancyDueDateInput {
  mode: PregnancyDueDateMode
  lmpDate: string
  conceptionDate: string
  todayDate: string
}

export interface PregnancyDueDateResult {
  mode: PregnancyDueDateMode
  dueDate: string
  pregnancyStartDate: string
  gestationalAgeTotalDays: number
  gestationalWeeks: number
  gestationalDays: number
  daysUntilDue: number
  trimester: PregnancyTrimester
  status: PregnancyTimelineStatus
}

export interface PregnancyDueDateValidationIssue {
  field: PregnancyDueDateInputField
  messageKey: string
}
