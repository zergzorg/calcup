export interface CountdownInput {
  startDate: string
  targetDate: string
  includeStartDate: boolean
}

export type CountdownInputField = 'startDate' | 'targetDate'

export type CountdownDirection = 'future' | 'past' | 'today'

export interface DateOnly {
  year: number
  month: number
  day: number
}

export interface CountdownResult {
  days: number
  calendarDays: number
  fullWeeks: number
  remainingDays: number
  direction: CountdownDirection
}

export interface CountdownValidationIssue {
  field: CountdownInputField
  messageKey: string
}
