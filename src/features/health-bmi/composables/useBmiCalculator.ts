import { computed, ref } from 'vue'
import { calculateBmiResult } from '../lib/calculations'
import type { BmiInputField, BmiValidationIssue } from '../types/bmi'

const HEIGHT_MIN = 50
const HEIGHT_MAX = 250
const WEIGHT_MIN = 10
const WEIGHT_MAX = 400

function validateNumber(
  field: BmiInputField,
  value: number,
  min: number,
  max: number,
): BmiValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `bmi.validation.${field}.required` }
  }

  if (value < min || value > max) {
    return { field, messageKey: `bmi.validation.${field}.range` }
  }

  return null
}

export function useBmiCalculator() {
  const heightCm = ref(175)
  const weightKg = ref(70)

  const issues = computed(() => {
    const nextIssues: BmiValidationIssue[] = []
    const heightIssue = validateNumber('heightCm', heightCm.value, HEIGHT_MIN, HEIGHT_MAX)
    const weightIssue = validateNumber('weightKg', weightKg.value, WEIGHT_MIN, WEIGHT_MAX)

    if (heightIssue) nextIssues.push(heightIssue)
    if (weightIssue) nextIssues.push(weightIssue)

    return nextIssues
  })

  const result = computed(() =>
    issues.value.length === 0
      ? calculateBmiResult(weightKg.value, heightCm.value)
      : null,
  )

  function getIssue(field: BmiInputField): BmiValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    heightCm,
    weightKg,
    issues,
    result,
    getIssue,
  }
}
