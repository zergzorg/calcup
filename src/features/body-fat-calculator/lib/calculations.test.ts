import { describe, expect, it } from 'vitest'
import { calculateBodyFat, calculateNavyBodyFatPercent, getBodyFatCategory } from './calculations'

describe('body fat calculations', () => {
  it('calculates US Navy body fat for men', () => {
    expect(calculateNavyBodyFatPercent({ sex: 'male', heightCm: 178, neckCm: 40, waistCm: 88, hipCm: 96 })).toBe(17.3)
    expect(calculateNavyBodyFatPercent({ sex: 'male', heightCm: 180, neckCm: 40, waistCm: 90, hipCm: 96 })).toBe(18.5)
  })

  it('calculates US Navy body fat for women', () => {
    expect(calculateNavyBodyFatPercent({ sex: 'female', heightCm: 165, neckCm: 32, waistCm: 72, hipCm: 98 })).toBe(27.7)
    expect(calculateNavyBodyFatPercent({ sex: 'female', heightCm: 170, neckCm: 34, waistCm: 78, hipCm: 104 })).toBe(31.4)
  })

  it('classifies body fat categories', () => {
    expect(getBodyFatCategory('male', 17.3)).toBe('average')
    expect(getBodyFatCategory('female', 22)).toBe('fitness')
    expect(getBodyFatCategory('female', 33)).toBe('obese')
  })

  it('calculates optional fat and lean mass', () => {
    expect(calculateBodyFat({ sex: 'male', heightCm: 178, neckCm: 40, waistCm: 88, hipCm: 96 }, 82)).toEqual({
      sex: 'male',
      bodyFatPercent: 17.3,
      fatMassKg: 14.2,
      leanMassKg: 67.8,
      categoryKey: 'average',
    })
  })

  it('rejects invalid measurements', () => {
    expect(calculateNavyBodyFatPercent({ sex: 'male', heightCm: 178, neckCm: 90, waistCm: 88, hipCm: 96 })).toBeNull()
    expect(calculateNavyBodyFatPercent({ sex: 'female', heightCm: 165, neckCm: 180, waistCm: 72, hipCm: 98 })).toBeNull()
    expect(calculateBodyFat({ sex: 'male', heightCm: 0, neckCm: 40, waistCm: 88, hipCm: 96 })).toBeNull()
  })
})
