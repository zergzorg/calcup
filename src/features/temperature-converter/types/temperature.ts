export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin'

export interface TemperatureConversionResult {
  value: number
  formatted: string
}

export interface TemperatureValidationIssue {
  field: 'value'
  messageKey: 'temperature.errors.invalid' | 'temperature.errors.belowAbsoluteZero'
}