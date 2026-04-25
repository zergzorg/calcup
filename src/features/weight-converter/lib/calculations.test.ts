import { describe, it, expect } from 'vitest'
import { convertWeight, isValidWeightValue, formatWeight } from './calculations'

describe('convertWeight', () => {
  it('1 kg → 1000 g', () => {
    expect(convertWeight(1, 'kilogram', 'gram')).toBe(1000)
  })

  it('1000 g → 1 kg', () => {
    expect(convertWeight(1000, 'gram', 'kilogram')).toBe(1)
  })

  it('1 ton → 1000 kg', () => {
    expect(convertWeight(1, 'ton', 'kilogram')).toBe(1000)
  })

  it('1 pound → 0.45359237 kg', () => {
    expect(convertWeight(1, 'pound', 'kilogram')).toBeCloseTo(0.45359237, 5)
  })

  it('1 kg → 2.20462262 pounds', () => {
    expect(convertWeight(1, 'kilogram', 'pound')).toBeCloseTo(2.20462262, 5)
  })

  it('1 ounce → 28.349523125 g', () => {
    expect(convertWeight(1, 'ounce', 'gram')).toBeCloseTo(28.349523125, 5)
  })

  it('1 stone → 14 pounds', () => {
    expect(convertWeight(1, 'stone', 'pound')).toBe(14)
  })

  it('identical units return original value', () => {
    expect(convertWeight(5, 'kilogram', 'kilogram')).toBe(5)
    expect(convertWeight(500, 'gram', 'gram')).toBe(500)
    expect(convertWeight(2, 'ton', 'ton')).toBe(2)
  })
})

describe('isValidWeightValue', () => {
  it('0 is valid', () => {
    expect(isValidWeightValue(0)).toBe(true)
  })

  it('positive values are valid', () => {
    expect(isValidWeightValue(1)).toBe(true)
    expect(isValidWeightValue(100.5)).toBe(true)
  })

  it('negative values are invalid', () => {
    expect(isValidWeightValue(-1)).toBe(false)
    expect(isValidWeightValue(-0.001)).toBe(false)
  })

  it('NaN is invalid', () => {
    expect(isValidWeightValue(NaN)).toBe(false)
  })

  it('Infinity is invalid', () => {
    expect(isValidWeightValue(Infinity)).toBe(false)
    expect(isValidWeightValue(-Infinity)).toBe(false)
  })
})

describe('formatWeight', () => {
  it('returns integer without decimals for whole numbers', () => {
    expect(formatWeight(1000)).toBe('1000')
    expect(formatWeight(1)).toBe('1')
  })

  it('handles small values with exponential notation', () => {
    expect(formatWeight(0.00001)).toBe('1.00e-5')
  })

  it('returns dash for non-finite values', () => {
    expect(formatWeight(NaN)).toBe('—')
    expect(formatWeight(Infinity)).toBe('—')
  })

  it('returns 0 for zero', () => {
    expect(formatWeight(0)).toBe('0')
  })
})