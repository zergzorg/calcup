export type CalorieSex = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'

export type CalorieGoal = 'lose' | 'mildLose' | 'maintain' | 'gain'

export type CalorieInputField = 'age' | 'heightCm' | 'weightKg'

export interface CalorieInput {
  sex: CalorieSex
  age: number
  heightCm: number
  weightKg: number
  activityLevel: ActivityLevel
  goal: CalorieGoal
}

export interface CalorieResult {
  bmr: number
  tdee: number
  targetCalories: number
  activityFactor: number
  dailyDelta: number
}

export interface CalorieValidationIssue {
  field: CalorieInputField
  messageKey: string
}
