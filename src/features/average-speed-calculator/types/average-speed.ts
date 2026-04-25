export interface AverageSpeedInput {
  distanceKm: number
  hours: number
  minutes: number
}

export interface AverageSpeedResult {
  totalMinutes: number
  speedKmH: number
  speedMph: number
  speedMs: number
  paceSecondsPerKm: number
}

export type AverageSpeedInputField = keyof AverageSpeedInput

export interface AverageSpeedValidationIssue {
  field: AverageSpeedInputField
  messageKey: string
}
