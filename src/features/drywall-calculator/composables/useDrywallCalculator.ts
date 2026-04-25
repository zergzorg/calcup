import { computed, reactive } from 'vue'
import { calculateDrywall, isNonNegative, isPositive, isPositiveInteger } from '../lib/calculations'
import type { DrywallInput, DrywallInputField, DrywallValidationIssue } from '../types/drywall'

export function useDrywallCalculator() {
  const input = reactive<DrywallInput>({
    wallLength: 5,
    wallHeight: 2.8,
    openingsArea: 1.8,
    sheetWidth: 1.2,
    sheetHeight: 2.5,
    layers: 1,
    wastePercent: 10,
    studSpacingMm: 600,
    screwsPerSheet: 35,
    sheetPrice: 420,
  })

  const issues = computed<DrywallValidationIssue[]>(() => {
    const next: DrywallValidationIssue[] = []

    for (const field of ['wallLength', 'wallHeight', 'sheetWidth', 'sheetHeight', 'studSpacingMm'] as DrywallInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `drywall.validation.${field}.positive` })
    }

    for (const field of ['openingsArea', 'wastePercent', 'sheetPrice'] as DrywallInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `drywall.validation.${field}.nonNegative` })
    }

    for (const field of ['layers', 'screwsPerSheet'] as DrywallInputField[]) {
      if (!isPositiveInteger(input[field])) next.push({ field, messageKey: `drywall.validation.${field}.positiveInteger` })
    }

    if (isPositive(input.wallLength) && isPositive(input.wallHeight) && isNonNegative(input.openingsArea)) {
      if (input.openingsArea >= input.wallLength * input.wallHeight) {
        next.push({ field: 'openingsArea', messageKey: 'drywall.validation.openingsArea.tooLarge' })
      }
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateDrywall(input),
  )

  function getIssue(field: DrywallInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setSheetSize(width: number, height: number) {
    input.sheetWidth = width
    input.sheetHeight = height
  }

  function setWastePercent(value: number) {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setSheetSize,
    setWastePercent,
  }
}
