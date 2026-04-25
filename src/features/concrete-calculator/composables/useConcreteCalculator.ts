import { computed, reactive } from 'vue'
import { calculateConcrete, isNonNegative, isPositive } from '../lib/calculations'
import type { ConcreteInput, ConcreteInputField, ConcreteValidationIssue } from '../types/concrete'

export function useConcreteCalculator() {
  const input = reactive<ConcreteInput>({
    lengthM: 4,
    widthM: 3,
    thicknessMm: 120,
    wastePercent: 5,
    bagYieldLiters: 12,
    pricePerM3: 6200,
  })

  const issues = computed<ConcreteValidationIssue[]>(() => {
    const next: ConcreteValidationIssue[] = []

    for (const field of ['lengthM', 'widthM', 'thicknessMm', 'bagYieldLiters'] as ConcreteInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `concrete.validation.${field}.positive` })
    }

    for (const field of ['wastePercent', 'pricePerM3'] as ConcreteInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `concrete.validation.${field}.nonNegative` })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateConcrete(input),
  )

  function getIssue(field: ConcreteInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setThickness(value: number) {
    input.thicknessMm = value
  }

  function setWastePercent(value: number) {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setThickness,
    setWastePercent,
  }
}
