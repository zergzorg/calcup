import { computed, reactive } from 'vue'
import { calculateBrick, isNonNegative, isPositive } from '../lib/calculations'
import type { BrickInput, BrickInputField, BrickValidationIssue } from '../types/brick'

export function useBrickCalculator() {
  const input = reactive<BrickInput>({
    wallLength: 10,
    wallHeight: 3,
    openingsArea: 4,
    brickLengthMm: 250,
    brickWidthMm: 120,
    brickHeightMm: 65,
    jointMm: 10,
    thicknessBricks: 0.5,
    wastePercent: 5,
    mortarSharePercent: 25,
    brickPrice: 18,
  })

  const issues = computed<BrickValidationIssue[]>(() => {
    const next: BrickValidationIssue[] = []

    for (const field of ['wallLength', 'wallHeight', 'brickLengthMm', 'brickWidthMm', 'brickHeightMm', 'thicknessBricks'] as BrickInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `brick.validation.${field}.positive` })
    }

    for (const field of ['openingsArea', 'jointMm', 'wastePercent', 'mortarSharePercent', 'brickPrice'] as BrickInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `brick.validation.${field}.nonNegative` })
    }

    if (isPositive(input.wallLength) && isPositive(input.wallHeight) && isNonNegative(input.openingsArea)) {
      if (input.openingsArea >= input.wallLength * input.wallHeight) {
        next.push({ field: 'openingsArea', messageKey: 'brick.validation.openingsArea.tooLarge' })
      }
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateBrick(input),
  )

  function getIssue(field: BrickInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setBrickSize(length: number, width: number, height: number) {
    input.brickLengthMm = length
    input.brickWidthMm = width
    input.brickHeightMm = height
  }

  return {
    input,
    result,
    getIssue,
    setBrickSize,
  }
}
