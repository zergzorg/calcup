import { computed, reactive } from 'vue'
import { calculateBlocks, isNonNegative, isPositive } from '../lib/calculations'
import type { BlocksInput, BlocksInputField, BlocksValidationIssue } from '../types/blocks'

export function useBlocksCalculator() {
  const input = reactive<BlocksInput>({
    wallLength: 8,
    wallHeight: 3,
    openingsArea: 3,
    blockLengthMm: 600,
    blockHeightMm: 250,
    blockWidthMm: 300,
    wastePercent: 5,
    adhesiveKgPerM2: 5,
    bagWeightKg: 25,
    blockPrice: 180,
  })

  const issues = computed<BlocksValidationIssue[]>(() => {
    const next: BlocksValidationIssue[] = []

    for (const field of ['wallLength', 'wallHeight', 'blockLengthMm', 'blockHeightMm', 'blockWidthMm', 'bagWeightKg'] as BlocksInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `blocks.validation.${field}.positive` })
    }

    for (const field of ['openingsArea', 'wastePercent', 'adhesiveKgPerM2', 'blockPrice'] as BlocksInputField[]) {
      if (!isNonNegative(input[field])) next.push({ field, messageKey: `blocks.validation.${field}.nonNegative` })
    }

    if (isPositive(input.wallLength) && isPositive(input.wallHeight) && isNonNegative(input.openingsArea)) {
      if (input.openingsArea >= input.wallLength * input.wallHeight) {
        next.push({ field: 'openingsArea', messageKey: 'blocks.validation.openingsArea.tooLarge' })
      }
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateBlocks(input),
  )

  function getIssue(field: BlocksInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setBlockSize(length: number, height: number, width: number) {
    input.blockLengthMm = length
    input.blockHeightMm = height
    input.blockWidthMm = width
  }

  function setWastePercent(value: number) {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setBlockSize,
    setWastePercent,
  }
}
