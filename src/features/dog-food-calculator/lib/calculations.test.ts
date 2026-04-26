import { describe, expect, it } from 'vitest'
import { calculateDogFood, calculateDogRer, getDogFoodMultiplier } from './calculations'

describe('calculateDogRer', () => {
  it('calculates resting energy requirement from weight', () => {
    expect(calculateDogRer(10)).toBe(394)
    expect(calculateDogRer(25)).toBe(783)
  })

  it('rejects invalid weight', () => {
    expect(calculateDogRer(0)).toBeNull()
    expect(calculateDogRer(Number.NaN)).toBeNull()
  })
})

describe('getDogFoodMultiplier', () => {
  it('returns profile multipliers', () => {
    expect(getDogFoodMultiplier('weightLoss')).toBe(1)
    expect(getDogFoodMultiplier('neuteredAdult')).toBe(1.6)
    expect(getDogFoodMultiplier('puppyUnder4')).toBe(3)
  })
})

describe('calculateDogFood', () => {
  it('calculates daily calories and grams of food', () => {
    expect(calculateDogFood({
      weightKg: 10,
      profile: 'neuteredAdult',
      caloriesPer100g: 360,
      treatPercent: 10,
    })).toEqual({
      rerCalories: 394,
      dailyCalories: 630,
      foodCalories: 567,
      gramsPerDay: 157.5,
      gramsPerMealTwo: 78.8,
      multiplier: 1.6,
    })
  })

  it('rejects impossible food inputs', () => {
    expect(calculateDogFood({
      weightKg: 10,
      profile: 'active',
      caloriesPer100g: 0,
      treatPercent: 10,
    })).toBeNull()

    expect(calculateDogFood({
      weightKg: 10,
      profile: 'active',
      caloriesPer100g: 360,
      treatPercent: 50,
    })).toBeNull()
  })
})
