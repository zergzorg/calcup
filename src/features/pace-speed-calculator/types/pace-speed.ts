export type PaceSpeedMode = 'paceToSpeed' | 'speedToPace'

export interface PaceInput {
  minutes: number
  seconds: number
}

export interface PaceParts {
  minutes: number
  seconds: number
  totalMinutes: number
}

export interface PaceToSpeedResult {
  speedKmH: number
  speedMph: number
  paceMinPerKm: PaceParts
  paceMinPerMile: PaceParts
}

export interface SpeedToPaceResult {
  speedKmH: number
  speedMph: number
  paceMinPerKm: PaceParts
  paceMinPerMile: PaceParts
}

export interface PaceSpeedValidationIssue {
  field: 'paceMinutes' | 'paceSeconds' | 'speed'
  messageKey: string
}
