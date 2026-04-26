import { computed, reactive } from 'vue'
import { calculateDogAge } from '../lib/calculations'
import type { DogAgeInput, DogAgeInputField, DogAgeValidationIssue } from '../types/dog-age'

function validateInput(input: DogAgeInput): DogAgeValidationIssue[] {
  const issues: DogAgeValidationIssue[] = []

  if (!Number.isFinite(input.years)) {
    issues.push({ field: 'years', messageKey: 'dogAge.validation.years.required' })
  } else if (input.years < 0 || input.years > 30) {
    issues.push({ field: 'years', messageKey: 'dogAge.validation.years.range' })
  }

  if (!Number.isFinite(input.months)) {
    issues.push({ field: 'months', messageKey: 'dogAge.validation.months.required' })
  } else if (input.months < 0 || input.months > 11) {
    issues.push({ field: 'months', messageKey: 'dogAge.validation.months.range' })
  }

  if (Number.isFinite(input.years) && Number.isFinite(input.months) && input.years === 0 && input.months === 0) {
    issues.push({ field: 'months', messageKey: 'dogAge.validation.age.positive' })
  }

  return issues
}

export function useDogAgeCalculator() {
  const input = reactive<DogAgeInput>({
    years: 5,
    months: 0,
    size: 'medium',
  })

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateDogAge(input)))

  function getIssue(field: DogAgeInputField): DogAgeValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    input,
    issues,
    result,
    getIssue,
  }
}
