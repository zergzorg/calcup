import { computed, reactive } from 'vue'
import { calculateDogFood } from '../lib/calculations'
import type { DogFoodInput, DogFoodInputField, DogFoodValidationIssue } from '../types/dog-food'

function validateInput(input: DogFoodInput): DogFoodValidationIssue[] {
  const issues: DogFoodValidationIssue[] = []

  if (!Number.isFinite(input.weightKg)) {
    issues.push({ field: 'weightKg', messageKey: 'dogFood.validation.weightKg.required' })
  } else if (input.weightKg < 0.5 || input.weightKg > 120) {
    issues.push({ field: 'weightKg', messageKey: 'dogFood.validation.weightKg.range' })
  }

  if (!Number.isFinite(input.caloriesPer100g)) {
    issues.push({ field: 'caloriesPer100g', messageKey: 'dogFood.validation.caloriesPer100g.required' })
  } else if (input.caloriesPer100g < 150 || input.caloriesPer100g > 650) {
    issues.push({ field: 'caloriesPer100g', messageKey: 'dogFood.validation.caloriesPer100g.range' })
  }

  if (!Number.isFinite(input.treatPercent)) {
    issues.push({ field: 'treatPercent', messageKey: 'dogFood.validation.treatPercent.required' })
  } else if (input.treatPercent < 0 || input.treatPercent > 30) {
    issues.push({ field: 'treatPercent', messageKey: 'dogFood.validation.treatPercent.range' })
  }

  return issues
}

export function useDogFoodCalculator() {
  const input = reactive<DogFoodInput>({
    weightKg: 10,
    profile: 'neuteredAdult',
    caloriesPer100g: 360,
    treatPercent: 10,
  })

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateDogFood(input)))

  function getIssue(field: DogFoodInputField): DogFoodValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    input,
    issues,
    result,
    getIssue,
  }
}
