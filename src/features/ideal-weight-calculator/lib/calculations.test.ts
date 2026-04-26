import { describe, expect, it } from 'vitest'
import {
  calculateBmiWeightRange,
  calculateFormulaWeight,
  calculateIdealWeightResult,
} from './calculations'

describe('ideal weight calculations', () => {
  it('calculates Devine formula for men and women', () => {
    expect(calculateFormulaWeight('male', 180, 'devine')).toBe(75)
    expect(calculateFormulaWeight('female', 165, 'devine')).toBe(56.9)
  })

  it('calculates Robinson, Miller and Hamwi formulas', () => {
    expect(calculateFormulaWeight('male', 180, 'robinson')).toBe(72.6)
    expect(calculateFormulaWeight('male', 180, 'miller')).toBe(71.5)
    expect(calculateFormulaWeight('male', 180, 'hamwi')).toBe(77.3)
  })

  it('calculates a BMI healthy weight range', () => {
    expect(calculateBmiWeightRange(180)).toEqual({ minKg: 59.9, maxKg: 80.7 })
  })

  it('returns a full estimate with formula average and min/max', () => {
    expect(calculateIdealWeightResult('male', 180)).toEqual({
      recommendedKg: 74.1,
      minFormulaKg: 71.5,
      maxFormulaKg: 77.3,
      bmiMinKg: 59.9,
      bmiMaxKg: 80.7,
      formulas: [
        { formula: 'devine', weightKg: 75 },
        { formula: 'robinson', weightKg: 72.6 },
        { formula: 'miller', weightKg: 71.5 },
        { formula: 'hamwi', weightKg: 77.3 },
      ],
    })
  })

  it('returns null for invalid input values', () => {
    expect(calculateFormulaWeight('male', 0, 'devine')).toBeNull()
    expect(calculateFormulaWeight('female', Number.NaN, 'hamwi')).toBeNull()
    expect(calculateBmiWeightRange(0)).toBeNull()
    expect(calculateIdealWeightResult('male', Number.NaN)).toBeNull()
  })
})
