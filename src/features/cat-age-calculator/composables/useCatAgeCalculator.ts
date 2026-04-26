import { computed, reactive } from 'vue'
import { calculateCatAge } from '../lib/calculations'
import type { CatAgeInput, CatAgeInputField, CatAgeValidationIssue } from '../types/cat-age'

function validateInput(input: CatAgeInput): CatAgeValidationIssue[] {
  const issues: CatAgeValidationIssue[] = []

  if (!Number.isFinite(input.years)) {
    issues.push({ field: 'years', messageKey: 'catAge.validation.years.required' })
  } else if (input.years < 0 || input.years > 35) {
    issues.push({ field: 'years', messageKey: 'catAge.validation.years.range' })
  }

  if (!Number.isFinite(input.months)) {
    issues.push({ field: 'months', messageKey: 'catAge.validation.months.required' })
  } else if (input.months < 0 || input.months > 11) {
    issues.push({ field: 'months', messageKey: 'catAge.validation.months.range' })
  }

  if (Number.isFinite(input.years) && Number.isFinite(input.months) && input.years === 0 && input.months === 0) {
    issues.push({ field: 'months', messageKey: 'catAge.validation.age.positive' })
  }

  return issues
}

export function useCatAgeCalculator() {
  const input = reactive<CatAgeInput>({
    years: 5,
    months: 0,
  })

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateCatAge(input)))

  function getIssue(field: CatAgeInputField): CatAgeValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    input,
    issues,
    result,
    getIssue,
  }
}
