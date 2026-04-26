import { computed, reactive } from 'vue'
import { calculateCatCalories } from '../lib/calculations'
import type { CatCalorieInput, CatCalorieInputField, CatCalorieValidationIssue } from '../types/cat-calorie'

function validateInput(input: CatCalorieInput): CatCalorieValidationIssue[] {
  const issues: CatCalorieValidationIssue[] = []

  if (!Number.isFinite(input.weightKg)) {
    issues.push({ field: 'weightKg', messageKey: 'catCalorie.validation.weightKg.required' })
  } else if (input.weightKg < 0.5 || input.weightKg > 15) {
    issues.push({ field: 'weightKg', messageKey: 'catCalorie.validation.weightKg.range' })
  }

  if (!Number.isFinite(input.caloriesPer100g)) {
    issues.push({ field: 'caloriesPer100g', messageKey: 'catCalorie.validation.caloriesPer100g.required' })
  } else if (input.caloriesPer100g < 120 || input.caloriesPer100g > 650) {
    issues.push({ field: 'caloriesPer100g', messageKey: 'catCalorie.validation.caloriesPer100g.range' })
  }

  if (!Number.isFinite(input.treatPercent)) {
    issues.push({ field: 'treatPercent', messageKey: 'catCalorie.validation.treatPercent.required' })
  } else if (input.treatPercent < 0 || input.treatPercent > 20) {
    issues.push({ field: 'treatPercent', messageKey: 'catCalorie.validation.treatPercent.range' })
  }

  return issues
}

export function useCatCalorieCalculator() {
  const input = reactive<CatCalorieInput>({
    weightKg: 4,
    profile: 'neuteredAdult',
    caloriesPer100g: 380,
    treatPercent: 5,
  })

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateCatCalories(input)))

  function getIssue(field: CatCalorieInputField): CatCalorieValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    input,
    issues,
    result,
    getIssue,
  }
}
