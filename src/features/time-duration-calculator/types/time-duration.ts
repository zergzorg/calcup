export type TimeDurationOperation = 'add' | 'subtract'

export interface TimeDurationInput {
  firstHours: number
  firstMinutes: number
  firstSeconds: number
  secondHours: number
  secondMinutes: number
  secondSeconds: number
  operation: TimeDurationOperation
}

export type TimeDurationInputField = Exclude<keyof TimeDurationInput, 'operation'>

export interface DurationParts {
  hours: number
  minutes: number
  seconds: number
}

export interface TimeDurationResult {
  sign: 1 | -1
  totalSeconds: number
  absoluteSeconds: number
  parts: DurationParts
  formatted: string
  totalMinutes: number
  totalHours: number
}

export interface TimeDurationValidationIssue {
  field: TimeDurationInputField
  messageKey: string
}
