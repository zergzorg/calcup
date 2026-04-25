export interface RaceSplitInput {
  distanceKm: number
  hours: number
  minutes: number
  seconds: number
  splitDistanceKm: number
}

export interface RaceSplitPoint {
  distanceKm: number
  cumulativeSeconds: number
}

export interface RaceSplitResult {
  distanceKm: number
  totalSeconds: number
  paceSecondsPerKm: number
  speedKmH: number
  splits: RaceSplitPoint[]
}

export type RaceSplitInputField = keyof RaceSplitInput

export interface RaceSplitValidationIssue {
  field: RaceSplitInputField
  messageKey: string
}
