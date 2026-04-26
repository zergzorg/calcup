export type DogFoodProfile = 'weightLoss' | 'neuteredAdult' | 'intactAdult' | 'active' | 'puppyUnder4' | 'puppyOver4' | 'senior'
export type DogFoodInputField = 'weightKg' | 'caloriesPer100g' | 'treatPercent'

export interface DogFoodInput {
  weightKg: number
  profile: DogFoodProfile
  caloriesPer100g: number
  treatPercent: number
}

export interface DogFoodResult {
  rerCalories: number
  dailyCalories: number
  foodCalories: number
  gramsPerDay: number
  gramsPerMealTwo: number
  multiplier: number
}

export interface DogFoodValidationIssue {
  field: DogFoodInputField
  messageKey: string
}
