import { describe, expect, it } from 'vitest'
import { convertSpeed } from './calculations'

describe('speed converter calculations', () => {
  it('converts kilometers per hour to meters per second', () => {
    expect(convertSpeed(36, 'kilometerPerHour', 'meterPerSecond')).toBeCloseTo(10, 10)
  })

  it('converts miles per hour to kilometers per hour', () => {
    expect(convertSpeed(60, 'milePerHour', 'kilometerPerHour')).toBeCloseTo(96.56064, 5)
  })

  it('converts knots to meters per second', () => {
    expect(convertSpeed(10, 'knot', 'meterPerSecond')).toBeCloseTo(5.1444444444, 10)
  })

  it('converts pace to speed', () => {
    expect(convertSpeed(5, 'minutePerKilometer', 'kilometerPerHour')).toBeCloseTo(12, 10)
  })

  it('converts speed to pace', () => {
    expect(convertSpeed(10, 'kilometerPerHour', 'minutePerKilometer')).toBeCloseTo(6, 10)
  })

  it('rejects invalid values and zero pace', () => {
    expect(convertSpeed(-1, 'kilometerPerHour', 'milePerHour')).toBeNull()
    expect(convertSpeed(Number.NaN, 'kilometerPerHour', 'milePerHour')).toBeNull()
    expect(convertSpeed(0, 'minutePerKilometer', 'kilometerPerHour')).toBeNull()
    expect(convertSpeed(0, 'kilometerPerHour', 'minutePerKilometer')).toBeNull()
  })
})
