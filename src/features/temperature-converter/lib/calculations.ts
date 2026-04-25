import type { TemperatureUnit } from '../types/temperature'

const ABSOLUTE_ZERO: Record<TemperatureUnit, number> = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
}

function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9)
}

function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15
}

function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15
}

function toCelsius(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return value
    case 'fahrenheit':
      return fahrenheitToCelsius(value)
    case 'kelvin':
      return kelvinToCelsius(value)
  }
}

function fromCelsius(celsius: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return celsius
    case 'fahrenheit':
      return celsiusToFahrenheit(celsius)
    case 'kelvin':
      return celsiusToKelvin(celsius)
  }
}

export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit
): number {
  if (fromUnit === toUnit) {
    return value
  }
  const celsius = toCelsius(value, fromUnit)
  return fromCelsius(celsius, toUnit)
}

export function formatTemperature(value: number): string {
  if (!isFinite(value)) {
    return '—'
  }
  const rounded = Math.round(value * 100) / 100
  if (Number.isInteger(rounded)) {
    return rounded.toString()
  }
  return rounded.toFixed(2).replace(/\.?0+$/, '')
}

export function isValidTemperature(value: number, unit: TemperatureUnit): boolean {
  if (!Number.isFinite(value)) {
    return false
  }
  const absoluteZero = ABSOLUTE_ZERO[unit]
  return value >= absoluteZero
}

export function getFormula(fromUnit: TemperatureUnit, toUnit: TemperatureUnit): string {
  if (fromUnit === toUnit) {
    return ''
  }

  const formulas: Record<string, string> = {
    'celsius-fahrenheit': '°F = °C × 9/5 + 32',
    'fahrenheit-celsius': '°C = (°F − 32) × 5/9',
    'celsius-kelvin': 'K = °C + 273.15',
    'kelvin-celsius': '°C = K − 273.15',
    'fahrenheit-kelvin': 'K = (°F − 32) × 5/9 + 273.15',
    'kelvin-fahrenheit': '°F = (K − 273.15) × 9/5 + 32',
  }

  return formulas[`${fromUnit}-${toUnit}`] || ''
}