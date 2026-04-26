export interface WorkdaysInput {
  startDate: string
  endDate: string
  includeEndDate: boolean
}

export type WorkdaysInputField = 'startDate' | 'endDate'

export type WorkdaysDirection = 'future' | 'past' | 'same'

export interface DateOnly {
  year: number
  month: number
  day: number
}

export interface WorkdaysResult {
  workdays: number
  weekendDays: number
  calendarDays: number
  fullWeeks: number
  direction: WorkdaysDirection
}

export interface WorkdaysValidationIssue {
  field: WorkdaysInputField
  messageKey: string
}
