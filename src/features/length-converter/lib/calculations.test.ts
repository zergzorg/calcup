import { describe, expect, it } from 'vitest'
import { convertLength, isValidLengthValue } from './calculations'

describe('length conversion calculations', () => {
  it('converts meters to centimeters', () => {
    expect(convertLength(2, 'meter', 'centimeter')).toBe(200)
  })

  it('converts kilometers to meters', () => {
    expect(convertLength(3.5, 'kilometer', 'meter')).toBe(3500)
  })

  it('converts inches to centimeters', () => {
    expect(convertLength(10, 'inch', 'centimeter')).toBe(25.4)
  })

  it('converts feet to meters', () => {
    expect(convertLength(3, 'foot', 'meter')).toBe(0.9144)
  })

  it('converts miles to kilometers', () => {
    expect(convertLength(1, 'mile', 'kilometer')).toBe(1.609344)
  })

  it('returns the original value for matching units', () => {
    expect(convertLength(42.1234567, 'meter', 'meter')).toBe(42.1234567)
  })

  it('accepts zero as a valid length', () => {
    expect(isValidLengthValue(0)).toBe(true)
    expect(convertLength(0, 'meter', 'centimeter')).toBe(0)
  })

  it('rejects negative values', () => {
    expect(isValidLengthValue(-1)).toBe(false)
    expect(convertLength(-1, 'meter', 'centimeter')).toBeNull()
  })

  it('rejects NaN and Infinity', () => {
    expect(isValidLengthValue(Number.NaN)).toBe(false)
    expect(isValidLengthValue(Number.POSITIVE_INFINITY)).toBe(false)
    expect(convertLength(Number.NaN, 'meter', 'centimeter')).toBeNull()
    expect(convertLength(Number.POSITIVE_INFINITY, 'meter', 'centimeter')).toBeNull()
  })
})
