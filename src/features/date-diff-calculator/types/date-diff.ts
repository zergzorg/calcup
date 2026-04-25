export type DateDiffDirection = 'future' | 'past' | 'same'

export interface DateOnly {
  year: number
  month: number
  day: number
}

export interface DateDiffBreakdown {
  years: number
  months: number
  days: number
}

export interface DateDiffResult {
  days: number
  direction: DateDiffDirection
  breakdown: DateDiffBreakdown
}

export interface DateDiffValidationIssue {
  field: 'startDate' | 'endDate'
  messageKey: string
}
