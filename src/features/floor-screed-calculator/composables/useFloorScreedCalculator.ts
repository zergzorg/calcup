import { computed, reactive } from 'vue'
import { calculateFloorScreed, isNonNegative, isPositive } from '../lib/calculations'
import type { FloorScreedInput, FloorScreedInputField, FloorScreedValidationIssue } from '../types/floor-screed'

export function useFloorScreedCalculator() {
  const input = reactive<FloorScreedInput>({
    roomLength: 4,
    roomWidth: 3,
    excludedArea: 0,
    thicknessMm: 50,
    consumptionKgPerM2Mm: 1.8,
    wastePercent: 10,
    bagWeight: 25,
    bagPrice: 0,
  })

  const issues = computed<FloorScreedValidationIssue[]>(() => {
    const next: FloorScreedValidationIssue[] = []

    for (const field of ['roomLength', 'roomWidth', 'thicknessMm', 'consumptionKgPerM2Mm', 'bagWeight'] as FloorScreedInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `floorScreed.validation.${field}.positive` })
    }

    for (const field of ['excludedArea', 'wastePercent', 'bagPrice'] as FloorScreedInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `floorScreed.validation.${field}.nonNegative` })
    }

    const grossArea = input.roomLength * input.roomWidth
    if (isPositive(grossArea) && isNonNegative(input.excludedArea) && input.excludedArea >= grossArea) {
      next.push({ field: 'excludedArea', messageKey: 'floorScreed.validation.excludedArea.belowGross' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateFloorScreed(input),
  )

  function getIssue(field: FloorScreedInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setThickness(thicknessMm: number) {
    input.thicknessMm = thicknessMm
  }

  function setBagWeight(weight: number) {
    input.bagWeight = weight
  }

  return {
    input,
    result,
    getIssue,
    setThickness,
    setBagWeight,
  }
}
