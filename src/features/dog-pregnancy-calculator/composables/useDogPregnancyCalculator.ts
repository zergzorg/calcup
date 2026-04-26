import { computed, reactive, ref } from 'vue'
import { addDays, calculateDogPregnancy, formatDateOnly, parseDateOnly } from '../lib/calculations'
import type { DogPregnancyInput, DogPregnancyInputField, DogPregnancyMode, DogPregnancyValidationIssue } from '../types/dog-pregnancy'

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

function validateInput(input: DogPregnancyInput): DogPregnancyValidationIssue[] {
  const issues: DogPregnancyValidationIssue[] = []
  const activeField: DogPregnancyInputField = input.mode === 'ovulation' ? 'ovulationDate' : 'matingDate'
  const activeDate = input.mode === 'ovulation' ? input.ovulationDate : input.matingDate

  if (!parseDateOnly(activeDate)) {
    issues.push({
      field: activeField,
      messageKey: input.mode === 'ovulation'
        ? 'dogPregnancy.validation.ovulationDate.required'
        : 'dogPregnancy.validation.matingDate.required',
    })
  }

  if (!parseDateOnly(input.todayDate)) {
    issues.push({ field: 'todayDate', messageKey: 'dogPregnancy.validation.todayDate.required' })
  }

  return issues
}

export function useDogPregnancyCalculator() {
  const input = reactive<DogPregnancyInput>({
    mode: 'mating',
    matingDate: daysAgoIso(30),
    ovulationDate: daysAgoIso(30),
    todayDate: todayIso(),
  })
  const touched = ref<Set<DogPregnancyInputField>>(new Set())

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateDogPregnancy(input)))

  function setMode(mode: DogPregnancyMode): void {
    input.mode = mode
  }

  function touch(field: DogPregnancyInputField): void {
    touched.value.add(field)
  }

  function getIssue(field: DogPregnancyInputField): DogPregnancyValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return issues.value.find((issue) => issue.field === field)
  }

  return {
    input,
    result,
    setMode,
    touch,
    getIssue,
  }
}
