import { describe, expect, it } from 'vitest'
import {
  calculateBmr,
  calculateCalorieResult,
  calculateTargetCalories,
  calculateTdee,
} from './calculations'

describe('calorie calculations', () => {
  it('calculates BMR with the Mifflin-St Jeor formula for men', () => {
    expect(calculateBmr('male', 80, 180, 35)).toBe(1755)
  })

  it('calculates BMR with the Mifflin-St Jeor formula for women', () => {
    expect(calculateBmr('female', 65, 170, 30)).toBe(1402)
  })

  it('calculates TDEE from BMR and activity factor', () => {
    expect(calculateTdee(1755, 'moderate')).toBe(2720)
  })

  it('applies a goal delta to daily calories', () => {
    expect(calculateTargetCalories(2720, 'lose')).toBe(2220)
    expect(calculateTargetCalories(2720, 'maintain')).toBe(2720)
    expect(calculateTargetCalories(2720, 'gain')).toBe(3020)
  })

  it('returns a complete calorie estimate', () => {
    expect(calculateCalorieResult({
      sex: 'male',
      age: 35,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate',
      goal: 'mildLose',
    })).toEqual({
      bmr: 1755,
      tdee: 2720,
      targetCalories: 2470,
      activityFactor: 1.55,
      dailyDelta: -250,
    })
  })

  it('returns null for invalid input values', () => {
    expect(calculateBmr('male', 0, 180, 35)).toBeNull()
    expect(calculateBmr('male', 80, 0, 35)).toBeNull()
    expect(calculateBmr('male', 80, 180, 0)).toBeNull()
    expect(calculateTdee(Number.NaN, 'moderate')).toBeNull()
    expect(calculateTargetCalories(Number.NaN, 'maintain')).toBeNull()
    expect(calculateCalorieResult({
      sex: 'female',
      age: Number.NaN,
      heightCm: 170,
      weightKg: 65,
      activityLevel: 'light',
      goal: 'maintain',
    })).toBeNull()
  })
})
