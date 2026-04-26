import { computed, reactive, ref } from 'vue'
import { addDays, calculateCatPregnancy, formatDateOnly, parseDateOnly } from '../lib/calculations'
import type { CatPregnancyInput, CatPregnancyInputField, CatPregnancyValidationIssue } from '../types/cat-pregnancy'

function todayIso(): string {
  return formatDateOnly({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  })
}

function daysAgoIso(value: number): string {
  const today = parseDateOnly(todayIso())
  if (!today) return ''

  return formatDateOnly(addDays(today, -value))
}

function validateInput(input: CatPregnancyInput): CatPregnancyValidationIssue[] {
  const issues: CatPregnancyValidationIssue[] = []

  if (!parseDateOnly(input.matingDate)) {
    issues.push({ field: 'matingDate', messageKey: 'catPregnancy.validation.matingDate.required' })
  }

  if (!parseDateOnly(input.todayDate)) {
    issues.push({ field: 'todayDate', messageKey: 'catPregnancy.validation.todayDate.required' })
  }

  return issues
}

export function useCatPregnancyCalculator() {
  const input = reactive<CatPregnancyInput>({
    matingDate: daysAgoIso(30),
    todayDate: todayIso(),
  })
  const touched = ref<Set<CatPregnancyInputField>>(new Set())

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateCatPregnancy(input)))

  function touch(field: CatPregnancyInputField): void {
    touched.value.add(field)
  }

  function getIssue(field: CatPregnancyInputField): CatPregnancyValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return issues.value.find((issue) => issue.field === field)
  }

  return {
    input,
    result,
    touch,
    getIssue,
  }
}
