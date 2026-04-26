import { describe, expect, it } from 'vitest'
import { calculateCatCalories, calculateCatRer, getCatCalorieMultiplier } from './calculations'

describe('calculateCatRer', () => {
  it('calculates resting energy requirement from weight', () => {
    expect(calculateCatRer(4)).toBe(198)
    expect(calculateCatRer(6)).toBe(268)
  })

  it('rejects invalid weight', () => {
    expect(calculateCatRer(0)).toBeNull()
    expect(calculateCatRer(Number.NaN)).toBeNull()
  })
})

describe('getCatCalorieMultiplier', () => {
  it('returns profile multipliers', () => {
    expect(getCatCalorieMultiplier('weightLoss')).toBe(0.8)
    expect(getCatCalorieMultiplier('neuteredAdult')).toBe(1.2)
    expect(getCatCalorieMultiplier('kittenUnder4')).toBe(2.5)
  })
})

describe('calculateCatCalories', () => {
  it('calculates daily calories and grams of food', () => {
    expect(calculateCatCalories({
      weightKg: 4,
      profile: 'neuteredAdult',
      caloriesPer100g: 380,
      treatPercent: 5,
    })).toEqual({
      rerCalories: 198,
      dailyCalories: 238,
      foodCalories: 226,
      gramsPerDay: 59.5,
      gramsPerMealThree: 19.8,
      multiplier: 1.2,
    })
  })

  it('rejects impossible food inputs', () => {
    expect(calculateCatCalories({
      weightKg: 4,
      profile: 'active',
      caloriesPer100g: 0,
      treatPercent: 5,
    })).toBeNull()

    expect(calculateCatCalories({
      weightKg: 4,
      profile: 'active',
      caloriesPer100g: 380,
      treatPercent: 50,
    })).toBeNull()
  })
})
