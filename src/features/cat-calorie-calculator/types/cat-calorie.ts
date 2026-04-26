export type CatCalorieProfile = 'weightLoss' | 'neuteredAdult' | 'intactAdult' | 'active' | 'kittenUnder4' | 'kittenOver4' | 'senior'
export type CatCalorieInputField = 'weightKg' | 'caloriesPer100g' | 'treatPercent'

export interface CatCalorieInput {
  weightKg: number
  profile: CatCalorieProfile
  caloriesPer100g: number
  treatPercent: number
}

export interface CatCalorieResult {
  rerCalories: number
  dailyCalories: number
  foodCalories: number
  gramsPerDay: number
  gramsPerMealThree: number
  multiplier: number
}

export interface CatCalorieValidationIssue {
  field: CatCalorieInputField
  messageKey: string
}
