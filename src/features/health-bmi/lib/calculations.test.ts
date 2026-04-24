import { describe, expect, it } from 'vitest'
import { calculateBmi, calculateBmiResult, getBmiCategory } from './calculations'

describe('BMI calculations', () => {
  it('calculates BMI from weight in kilograms and height in centimeters', () => {
    expect(calculateBmi(70, 175)).toBe(22.9)
  })

  it('rounds BMI to one decimal place', () => {
    expect(calculateBmi(80, 180)).toBe(24.7)
  })

  it('detects category boundaries', () => {
    expect(getBmiCategory(18.4)).toBe('underweight')
    expect(getBmiCategory(18.5)).toBe('normal')
    expect(getBmiCategory(24.9)).toBe('normal')
    expect(getBmiCategory(25)).toBe('overweight')
    expect(getBmiCategory(29.9)).toBe('overweight')
    expect(getBmiCategory(30)).toBe('obesity')
  })

  it('returns null for invalid input values', () => {
    expect(calculateBmi(0, 175)).toBeNull()
    expect(calculateBmi(70, 0)).toBeNull()
    expect(calculateBmi(-70, 175)).toBeNull()
    expect(calculateBmi(70, -175)).toBeNull()
    expect(calculateBmi(Number.NaN, 175)).toBeNull()
    expect(calculateBmi(70, Number.NaN)).toBeNull()
    expect(calculateBmiResult(Number.NaN, 175)).toBeNull()
  })
})
