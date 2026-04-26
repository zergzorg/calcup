import { computed, ref } from 'vue'
import { calculateCalorieResult } from '../lib/calculations'
import type {
  ActivityLevel,
  CalorieGoal,
  CalorieInputField,
  CalorieSex,
  CalorieValidationIssue,
} from '../types/calorie'

const FIELD_RANGES: Record<CalorieInputField, { min: number; max: number }> = {
  age: { min: 10, max: 100 },
  heightCm: { min: 100, max: 230 },
  weightKg: { min: 30, max: 300 },
}

function validateNumber(field: CalorieInputField, value: number): CalorieValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `calorie.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `calorie.validation.${field}.range` }
  }

  return null
}

export function useCalorieCalculator() {
  const sex = ref<CalorieSex>('male')
  const age = ref(35)
  const heightCm = ref(180)
  const weightKg = ref(80)
  const activityLevel = ref<ActivityLevel>('moderate')
  const goal = ref<CalorieGoal>('maintain')

  const issues = computed<CalorieValidationIssue[]>(() =>
    ([
      ['age', age.value],
      ['heightCm', heightCm.value],
      ['weightKg', weightKg.value],
    ] satisfies Array<[CalorieInputField, number]>)
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is CalorieValidationIssue => Boolean(issue)),
  )

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateCalorieResult({
      sex: sex.value,
      age: age.value,
      heightCm: heightCm.value,
      weightKg: weightKg.value,
      activityLevel: activityLevel.value,
      goal: goal.value,
    })
  })

  function getIssue(field: CalorieInputField): CalorieValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    sex,
    age,
    heightCm,
    weightKg,
    activityLevel,
    goal,
    issues,
    result,
    getIssue,
  }
}
