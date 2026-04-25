import { describe, it, expect } from 'vitest'
import { convertTemperature, isValidTemperature, formatTemperature } from './calculations'

describe('convertTemperature', () => {
  it('0°C → 32°F', () => {
    expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32)
  })

  it('100°C → 212°F', () => {
    expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212)
  })

  it('32°F → 0°C', () => {
    expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0)
  })

  it('212°F → 100°C', () => {
    expect(convertTemperature(212, 'fahrenheit', 'celsius')).toBe(100)
  })

  it('0°C → 273.15K', () => {
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15)
  })

  it('273.15K → 0°C', () => {
    expect(convertTemperature(273.15, 'kelvin', 'celsius')).toBe(0)
  })

  it('-273.15°C → 0K', () => {
    expect(convertTemperature(-273.15, 'celsius', 'kelvin')).toBe(0)
  })

  it('-459.67°F → 0K', () => {
    expect(convertTemperature(-459.67, 'fahrenheit', 'kelvin')).toBeCloseTo(0, 2)
  })

  it('identical units return original value', () => {
    expect(convertTemperature(50, 'celsius', 'celsius')).toBe(50)
    expect(convertTemperature(100, 'fahrenheit', 'fahrenheit')).toBe(100)
    expect(convertTemperature(300, 'kelvin', 'kelvin')).toBe(300)
  })
})

describe('isValidTemperature', () => {
  it('Kelvin < 0 is invalid', () => {
    expect(isValidTemperature(-1, 'kelvin')).toBe(false)
    expect(isValidTemperature(-0.01, 'kelvin')).toBe(false)
  })

  it('Kelvin >= 0 is valid', () => {
    expect(isValidTemperature(0, 'kelvin')).toBe(true)
    expect(isValidTemperature(273.15, 'kelvin')).toBe(true)
  })

  it('Celsius < -273.15 is invalid', () => {
    expect(isValidTemperature(-273.16, 'celsius')).toBe(false)
  })

  it('Celsius >= -273.15 is valid', () => {
    expect(isValidTemperature(-273.15, 'celsius')).toBe(true)
    expect(isValidTemperature(0, 'celsius')).toBe(true)
  })

  it('Fahrenheit < -459.67 is invalid', () => {
    expect(isValidTemperature(-459.68, 'fahrenheit')).toBe(false)
  })

  it('Fahrenheit >= -459.67 is valid', () => {
    expect(isValidTemperature(-459.67, 'fahrenheit')).toBe(true)
    expect(isValidTemperature(32, 'fahrenheit')).toBe(true)
  })

  it('NaN is invalid', () => {
    expect(isValidTemperature(NaN, 'celsius')).toBe(false)
    expect(isValidTemperature(NaN, 'fahrenheit')).toBe(false)
    expect(isValidTemperature(NaN, 'kelvin')).toBe(false)
  })

  it('Infinity is invalid', () => {
    expect(isValidTemperature(Infinity, 'celsius')).toBe(false)
    expect(isValidTemperature(-Infinity, 'celsius')).toBe(false)
  })

  it('0 is valid for all units', () => {
    expect(isValidTemperature(0, 'celsius')).toBe(true)
    expect(isValidTemperature(0, 'fahrenheit')).toBe(true)
    expect(isValidTemperature(0, 'kelvin')).toBe(true)
  })
})

describe('formatTemperature', () => {
  it('returns integer without decimals for whole numbers', () => {
    expect(formatTemperature(100)).toBe('100')
    expect(formatTemperature(0)).toBe('0')
    expect(formatTemperature(-40)).toBe('-40')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatTemperature(36.666)).toBe('36.67')
    expect(formatTemperature(36.664)).toBe('36.66')
  })

  it('removes trailing zeros', () => {
    expect(formatTemperature(36.6)).toBe('36.6')
    expect(formatTemperature(36.60)).toBe('36.6')
  })

  it('returns dash for non-finite values', () => {
    expect(formatTemperature(NaN)).toBe('—')
    expect(formatTemperature(Infinity)).toBe('—')
  })
})