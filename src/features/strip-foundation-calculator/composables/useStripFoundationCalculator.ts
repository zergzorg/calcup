import { computed, reactive } from 'vue'
import {
  calculateStripFoundation,
  isNonNegative,
  isPositive,
  isPositiveInteger,
} from '../lib/calculations'
import type {
  StripFoundationInput,
  StripFoundationInputField,
  StripFoundationValidationIssue,
} from '../types/strip-foundation'

export function useStripFoundationCalculator() {
  const input = reactive<StripFoundationInput>({
    totalLengthM: 40,
    widthMm: 400,
    heightMm: 800,
    sandDepthMm: 150,
    wastePercent: 10,
    rebarRuns: 4,
    rebarDiameterMm: 12,
    concretePricePerM3: 0,
    rebarPricePerKg: 0,
  })

  const issues = computed<StripFoundationValidationIssue[]>(() => {
    const next: StripFoundationValidationIssue[] = []

    for (const field of ['totalLengthM', 'widthMm', 'heightMm', 'rebarDiameterMm'] as StripFoundationInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `stripFoundation.validation.${field}.positive` })
    }

    for (const field of ['sandDepthMm', 'wastePercent', 'concretePricePerM3', 'rebarPricePerKg'] as StripFoundationInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `stripFoundation.validation.${field}.nonNegative` })
    }

    if (!isPositiveInteger(input.rebarRuns)) {
      next.push({ field: 'rebarRuns', messageKey: 'stripFoundation.validation.rebarRuns.integer' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateStripFoundation(input),
  )

  function getIssue(field: StripFoundationInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setWidth(value: number) {
    input.widthMm = value
  }

  function setHeight(value: number) {
    input.heightMm = value
  }

  function setWaste(value: number) {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setWidth,
    setHeight,
    setWaste,
  }
}
