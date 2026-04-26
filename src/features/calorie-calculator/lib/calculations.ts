import type { ActivityLevel, CalorieGoal, CalorieInput, CalorieResult, CalorieSex } from '../types/calorie'

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
}

export const GOAL_DELTAS: Record<CalorieGoal, number> = {
  lose: -500,
  mildLose: -250,
  maintain: 0,
  gain: 300,
}

export function roundCalories(value: number): number {
  return Math.round(value)
}

export function calculateBmr(sex: CalorieSex, weightKg: number, heightCm: number, age: number): number | null {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || !Number.isFinite(age)) return null
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return null

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  const sexAdjustment = sex === 'male' ? 5 : -161

  return roundCalories(base + sexAdjustment)
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number | null {
  const factor = ACTIVITY_FACTORS[activityLevel]

  if (!Number.isFinite(bmr) || bmr <= 0 || !Number.isFinite(factor)) return null

  return roundCalories(bmr * factor)
}

export function calculateTargetCalories(tdee: number, goal: CalorieGoal): number | null {
  const delta = GOAL_DELTAS[goal]

  if (!Number.isFinite(tdee) || tdee <= 0 || !Number.isFinite(delta)) return null

  return roundCalories(tdee + delta)
}

export function calculateCalorieResult(input: CalorieInput): CalorieResult | null {
  const bmr = calculateBmr(input.sex, input.weightKg, input.heightCm, input.age)
  if (bmr === null) return null

  const tdee = calculateTdee(bmr, input.activityLevel)
  if (tdee === null) return null

  const targetCalories = calculateTargetCalories(tdee, input.goal)
  if (targetCalories === null) return null

  return {
    bmr,
    tdee,
    targetCalories,
    activityFactor: ACTIVITY_FACTORS[input.activityLevel],
    dailyDelta: GOAL_DELTAS[input.goal],
  }
}
