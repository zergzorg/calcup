import { computed, reactive } from 'vue'
import { calculateInsulation, isNonNegative, isPositive, isPositiveInteger } from '../lib/calculations'
import type { InsulationInput, InsulationInputField, InsulationValidationIssue } from '../types/insulation'

export function useInsulationCalculator() {
  const input = reactive<InsulationInput>({
    surfaceArea: 42,
    excludedArea: 2,
    boardLengthM: 1.2,
    boardWidthM: 0.6,
    boardThicknessMm: 50,
    boardsPerPack: 8,
    wastePercent: 10,
    packPrice: 1450,
  })

  const issues = computed<InsulationValidationIssue[]>(() => {
    const next: InsulationValidationIssue[] = []

    for (const field of ['surfaceArea', 'boardLengthM', 'boardWidthM', 'boardThicknessMm'] as InsulationInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `insulation.validation.${field}.positive` })
    }

    if (!isPositiveInteger(input.boardsPerPack)) {
      next.push({ field: 'boardsPerPack', messageKey: 'insulation.validation.boardsPerPack.positiveInteger' })
    }

    for (const field of ['excludedArea', 'wastePercent', 'packPrice'] as InsulationInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `insulation.validation.${field}.nonNegative` })
    }

    if (isPositive(input.surfaceArea) && isNonNegative(input.excludedArea) && input.excludedArea >= input.surfaceArea) {
      next.push({ field: 'excludedArea', messageKey: 'insulation.validation.excludedArea.belowGross' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateInsulation(input),
  )

  function getIssue(field: InsulationInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setBoardSize(length: number, width: number) {
    input.boardLengthM = length
    input.boardWidthM = width
  }

  function setThickness(value: number) {
    input.boardThicknessMm = value
  }

  return {
    input,
    result,
    getIssue,
    setBoardSize,
    setThickness,
  }
}
