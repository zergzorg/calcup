import { computed, reactive } from 'vue'
import { calculateRebar, isNonNegative, isPositive, isPositiveInteger } from '../lib/calculations'
import type { RebarInput, RebarInputField, RebarValidationIssue } from '../types/rebar'

export function useRebarCalculator() {
  const input = reactive<RebarInput>({
    lengthM: 6,
    widthM: 4,
    spacingMm: 200,
    layers: 1,
    diameterMm: 12,
    barLengthM: 6,
    wastePercent: 10,
    pricePerKg: 65,
  })

  const issues = computed<RebarValidationIssue[]>(() => {
    const next: RebarValidationIssue[] = []

    for (const field of ['lengthM', 'widthM', 'spacingMm', 'diameterMm', 'barLengthM'] as RebarInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `rebar.validation.${field}.positive` })
    }

    if (!isPositiveInteger(input.layers)) {
      next.push({ field: 'layers', messageKey: 'rebar.validation.layers.integer' })
    }

    for (const field of ['wastePercent', 'pricePerKg'] as RebarInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `rebar.validation.${field}.nonNegative` })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateRebar(input),
  )

  function getIssue(field: RebarInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setDiameter(value: number) {
    input.diameterMm = value
  }

  function setSpacing(value: number) {
    input.spacingMm = value
  }

  function setWaste(value: number) {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setDiameter,
    setSpacing,
    setWaste,
  }
}
