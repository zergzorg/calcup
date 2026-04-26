import { computed, reactive } from 'vue'
import { calculateSlabFoundation } from '../lib/calculations'
import type { SlabFoundationInput, SlabFoundationInputField, SlabFoundationValidationIssue } from '../types/slab-foundation'

function validateInput(input: SlabFoundationInput): SlabFoundationValidationIssue[] {
  const issues: SlabFoundationValidationIssue[] = []
  const positiveFields: SlabFoundationInputField[] = ['lengthM', 'widthM', 'thicknessMm', 'rebarSpacingMm', 'rebarDiameterMm', 'rebarLayers']
  const nonNegativeFields: SlabFoundationInputField[] = ['sandDepthMm', 'gravelDepthMm', 'wastePercent', 'concretePricePerM3', 'rebarPricePerKg']

  for (const field of positiveFields) {
    if (!Number.isFinite(input[field]) || input[field] <= 0) {
      issues.push({ field, messageKey: `slabFoundation.validation.${field}` })
    }
  }

  for (const field of nonNegativeFields) {
    if (!Number.isFinite(input[field]) || input[field] < 0) {
      issues.push({ field, messageKey: `slabFoundation.validation.${field}` })
    }
  }

  if (!Number.isInteger(input.rebarLayers)) {
    issues.push({ field: 'rebarLayers', messageKey: 'slabFoundation.validation.rebarLayers' })
  }

  return issues
}

export function useSlabFoundationCalculator() {
  const input = reactive<SlabFoundationInput>({
    lengthM: 6,
    widthM: 4,
    thicknessMm: 200,
    sandDepthMm: 150,
    gravelDepthMm: 100,
    rebarSpacingMm: 200,
    rebarDiameterMm: 12,
    rebarLayers: 2,
    wastePercent: 10,
    concretePricePerM3: 0,
    rebarPricePerKg: 0,
  })

  const issues = computed(() => validateInput(input))
  const result = computed(() => (issues.value.length > 0 ? null : calculateSlabFoundation(input)))

  function getIssue(field: SlabFoundationInputField): SlabFoundationValidationIssue | undefined {
    return issues.value.find((issue) => issue.field === field)
  }

  function setThickness(value: number): void {
    input.thicknessMm = value
  }

  function setSpacing(value: number): void {
    input.rebarSpacingMm = value
  }

  function setWaste(value: number): void {
    input.wastePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setThickness,
    setSpacing,
    setWaste,
  }
}
