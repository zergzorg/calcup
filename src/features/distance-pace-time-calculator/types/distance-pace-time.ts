export type DistancePaceTimeMode = 'time' | 'pace' | 'distance'

export interface TimeInput {
  hours: number
  minutes: number
  seconds: number
}

export interface PaceInput {
  minutes: number
  seconds: number
}

export interface TimeParts {
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

export interface PaceParts {
  minutes: number
  seconds: number
  totalSeconds: number
}

export interface DistancePaceTimeResult {
  distanceKm: number
  time: TimeParts
  pace: PaceParts
  speedKmH: number
}

export interface DistancePaceTimeValidationIssue {
  field: 'distanceKm' | 'timeHours' | 'timeMinutes' | 'timeSeconds' | 'paceMinutes' | 'paceSeconds'
  messageKey: string
}
