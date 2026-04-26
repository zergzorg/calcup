import type { CatCalorieInput, CatCalorieProfile, CatCalorieResult } from '../types/cat-calorie'

const PROFILE_MULTIPLIERS: Record<CatCalorieProfile, number> = {
  weightLoss: 0.8,
  neuteredAdult: 1.2,
  intactAdult: 1.4,
  active: 1.6,
  kittenUnder4: 2.5,
  kittenOver4: 2,
  senior: 1.1,
}

function roundCalories(value: number): number {
  return Math.round(value)
}

function roundGrams(value: number): number {
  return Math.round(value * 10) / 10
}

export function getCatCalorieMultiplier(profile: CatCalorieProfile): number {
  return PROFILE_MULTIPLIERS[profile]
}

export function calculateCatRer(weightKg: number): number | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return null
  return roundCalories(70 * weightKg ** 0.75)
}

export function calculateCatCalories(input: CatCalorieInput): CatCalorieResult | null {
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

  const rerCalories = calculateCatRer(input.weightKg)
  if (rerCalories === null) return null

  const multiplier = getCatCalorieMultiplier(input.profile)
  const dailyCalories = roundCalories(rerCalories * multiplier)
  const foodCalories = roundCalories(dailyCalories * (1 - input.treatPercent / 100))
  const gramsPerDay = roundGrams(foodCalories / (input.caloriesPer100g / 100))

  return {
    rerCalories,
    dailyCalories,
    foodCalories,
    gramsPerDay,
    gramsPerMealThree: roundGrams(gramsPerDay / 3),
    multiplier,
  }
}
