import { computed, ref } from 'vue'
import { calculateSickLeave, isValidNonNegativeNumber, isValidPositiveNumber } from '../lib/calculations'
import type { SickLeaveExperience, SickLeaveInput, SickLeaveValidationIssue } from '../types/sick-leave'

export function useSickLeaveCalculator() {
  const income2024 = ref(1_000_000)
  const income2025 = ref(1_500_000)
  const sickDays = ref(10)
  const experience = ref<SickLeaveExperience>('from5to8')
  const taxPercent = ref(13)
  const touched = ref(new Set<SickLeaveValidationIssue['field']>())

  const input = computed<SickLeaveInput>(() => ({
    income2024: income2024.value,
    income2025: income2025.value,
    sickDays: sickDays.value,
    experience: experience.value,
    taxPercent: taxPercent.value,
  }))

  const issues = computed<SickLeaveValidationIssue[]>(() => {
    const result: SickLeaveValidationIssue[] = []

    if (!Number.isFinite(income2024.value)) {
      result.push({ field: 'income2024', messageKey: 'sickLeave.validation.income2024.required' })
    } else if (!isValidNonNegativeNumber(income2024.value)) {
      result.push({ field: 'income2024', messageKey: 'sickLeave.validation.income2024.nonNegative' })
    }

    if (!Number.isFinite(income2025.value)) {
      result.push({ field: 'income2025', messageKey: 'sickLeave.validation.income2025.required' })
    } else if (!isValidNonNegativeNumber(income2025.value)) {
      result.push({ field: 'income2025', messageKey: 'sickLeave.validation.income2025.nonNegative' })
    }

    if (!Number.isFinite(sickDays.value)) {
      result.push({ field: 'sickDays', messageKey: 'sickLeave.validation.sickDays.required' })
    } else if (!isValidPositiveNumber(sickDays.value)) {
      result.push({ field: 'sickDays', messageKey: 'sickLeave.validation.sickDays.positive' })
    }

    if (!Number.isFinite(taxPercent.value)) {
      result.push({ field: 'taxPercent', messageKey: 'sickLeave.validation.taxPercent.required' })
    } else if (!isValidNonNegativeNumber(taxPercent.value) || taxPercent.value > 100) {
      result.push({ field: 'taxPercent', messageKey: 'sickLeave.validation.taxPercent.percent' })
    }

    return result
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null
    return calculateSickLeave(input.value)
  })

  function touch(field: SickLeaveValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function getIssue(field: SickLeaveValidationIssue['field']) {
    if (!touched.value.has(field)) return undefined
    return issues.value.find(issue => issue.field === field)
  }

  return {
    income2024,
    income2025,
    sickDays,
    experience,
    taxPercent,
    issues,
    result,
    touch,
    getIssue,
  }
}
