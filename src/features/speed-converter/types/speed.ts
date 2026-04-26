export type SpeedUnit =
  | 'kilometerPerHour'
  | 'meterPerSecond'
  | 'milePerHour'
  | 'knot'
  | 'footPerSecond'
  | 'minutePerKilometer'

export interface SpeedValidationIssue {
  messageKey: string
}
