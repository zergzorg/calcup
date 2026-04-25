import { computed, reactive } from 'vue'
import { calculateLaminate, isNonNegative, isPositive } from '../lib/calculations'
import type { LaminateInput, LaminateInputField, LaminateValidationIssue } from '../types/laminate'

export function useLaminateCalculator() {
  const input = reactive<LaminateInput>({
    roomLength: 5,
    roomWidth: 4,
    excludedArea: 0,
    wastePercent: 10,
    packCoverage: 2.13,
    packPrice: 0,
  })

  const issues = computed<LaminateValidationIssue[]>(() => {
    const next: LaminateValidationIssue[] = []

    for (const field of ['roomLength', 'roomWidth', 'packCoverage'] as LaminateInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `laminate.validation.${field}.positive` })
    }

    for (const field of ['excludedArea', 'wastePercent', 'packPrice'] as LaminateInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `laminate.validation.${field}.nonNegative` })
    }

    const grossArea = input.roomLength * input.roomWidth
    if (isPositive(grossArea) && isNonNegative(input.excludedArea) && input.excludedArea >= grossArea) {
      next.push({ field: 'excludedArea', messageKey: 'laminate.validation.excludedArea.belowGross' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateLaminate(input),
  )

  function getIssue(field: LaminateInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setWastePercent(percent: number) {
    input.wastePercent = percent
  }

  function setPackCoverage(coverage: number) {
    input.packCoverage = coverage
  }

  return {
    input,
    result,
    getIssue,
    setWastePercent,
    setPackCoverage,
  }
}
