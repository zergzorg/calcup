import type { DogFoodInput, DogFoodProfile, DogFoodResult } from '../types/dog-food'

const PROFILE_MULTIPLIERS: Record<DogFoodProfile, number> = {
  weightLoss: 1,
  neuteredAdult: 1.6,
  intactAdult: 1.8,
  active: 2,
  puppyUnder4: 3,
  puppyOver4: 2,
  senior: 1.4,
}

function roundCalories(value: number): number {
  return Math.round(value)
}

function roundGrams(value: number): number {
  return Math.round(value * 10) / 10
}

export function getDogFoodMultiplier(profile: DogFoodProfile): number {
  return PROFILE_MULTIPLIERS[profile]
}

export function calculateDogRer(weightKg: number): number | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return null
  return roundCalories(70 * weightKg ** 0.75)
}

export function calculateDogFood(input: DogFoodInput): DogFoodResult | null {
  if (
    !Number.isFinite(input.weightKg) ||
    !Number.isFinite(input.caloriesPer100g) ||
    !Number.isFinite(input.treatPercent) ||
    input.weightKg <= 0 ||
    input.caloriesPer100g <= 0 ||
    input.treatPercent < 0 ||
    input.treatPercent >= 50
  ) {
    return null
  }

  const rerCalories = calculateDogRer(input.weightKg)
  if (rerCalories === null) return null

  const multiplier = getDogFoodMultiplier(input.profile)
  const dailyCalories = roundCalories(rerCalories * multiplier)
  const foodCalories = roundCalories(dailyCalories * (1 - input.treatPercent / 100))
  const gramsPerDay = roundGrams(foodCalories / (input.caloriesPer100g / 100))

  return {
    rerCalories,
    dailyCalories,
    foodCalories,
    gramsPerDay,
    gramsPerMealTwo: roundGrams(gramsPerDay / 2),
    multiplier,
  }
}
