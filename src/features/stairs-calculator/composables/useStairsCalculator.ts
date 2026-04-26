import { computed, reactive } from 'vue'
import { calculateStairs, isNonNegative, isPositive } from '../lib/calculations'
import type { StairsInput, StairsInputField, StairsValidationIssue } from '../types/stairs'

export const defaultStairsInput: StairsInput = {
  totalRiseCm: 280,
  targetRiserCm: 17,
  treadDepthCm: 28,
  stairWidthM: 0.9,
  wastePercent: 10,
  pricePerTread: 0,
}

export function validateStairsInput(input: StairsInput): StairsValidationIssue[] {
  const issues: StairsValidationIssue[] = []

  if (!isPositive(input.totalRiseCm)) issues.push({ field: 'totalRiseCm', messageKey: 'stairs.validation.totalRiseCm' })
  if (!isPositive(input.targetRiserCm)) issues.push({ field: 'targetRiserCm', messageKey: 'stairs.validation.targetRiserCm' })
  if (!isPositive(input.treadDepthCm)) issues.push({ field: 'treadDepthCm', messageKey: 'stairs.validation.treadDepthCm' })
  if (!isPositive(input.stairWidthM)) issues.push({ field: 'stairWidthM', messageKey: 'stairs.validation.stairWidthM' })
  if (!isNonNegative(input.wastePercent)) issues.push({ field: 'wastePercent', messageKey: 'stairs.validation.wastePercent' })
  if (!isNonNegative(input.pricePerTread)) issues.push({ field: 'pricePerTread', messageKey: 'stairs.validation.pricePerTread' })

  return issues
}

export function useStairsCalculator() {
  const input = reactive<StairsInput>({ ...defaultStairsInput })
  const issues = computed(() => validateStairsInput(input))
  const result = computed(() => issues.value.length ? null : calculateStairs(input))

  function getIssue(field: StairsInputField): StairsValidationIssue | undefined {
    return issues.value.find((issue) => issue.field === field)
  }

  function setRise(totalRiseCm: number): void {
    input.totalRiseCm = totalRiseCm
  }

  function setWaste(wastePercent: number): void {
    input.wastePercent = wastePercent
  }

  function updateNumber(field: StairsInputField, value: number): void {
    input[field] = value
  }

  return {
    input,
    issues,
    result,
    getIssue,
    setRise,
    setWaste,
    updateNumber,
  }
}
