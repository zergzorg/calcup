import { computed, reactive } from 'vue'
import { calculatePutty, isNonNegative, isPositive } from '../lib/calculations'
import type { PuttyInput, PuttyInputField, PuttyValidationIssue } from '../types/putty'

export function usePuttyCalculator() {
  const input = reactive<PuttyInput>({
    surfaceArea: 36,
    excludedArea: 2,
    layerThicknessMm: 2,
    consumptionKgPerM2Mm: 1.2,
    wastePercent: 10,
    bagWeightKg: 20,
    bagPrice: 620,
  })

  const issues = computed<PuttyValidationIssue[]>(() => {
    const next: PuttyValidationIssue[] = []

    for (const field of ['surfaceArea', 'layerThicknessMm', 'consumptionKgPerM2Mm', 'bagWeightKg'] as PuttyInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `putty.validation.${field}.positive` })
    }

    for (const field of ['excludedArea', 'wastePercent', 'bagPrice'] as PuttyInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `putty.validation.${field}.nonNegative` })
    }

    if (isPositive(input.surfaceArea) && isNonNegative(input.excludedArea) && input.excludedArea >= input.surfaceArea) {
      next.push({ field: 'excludedArea', messageKey: 'putty.validation.excludedArea.belowGross' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculatePutty(input),
  )

  function getIssue(field: PuttyInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setLayerThickness(value: number) {
    input.layerThicknessMm = value
  }

  function setBagWeight(value: number) {
    input.bagWeightKg = value
  }

  return {
    input,
    result,
    getIssue,
    setLayerThickness,
    setBagWeight,
  }
}
