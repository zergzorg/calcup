import { computed, ref } from 'vue'
import { calculateProportion } from '../lib/calculations'
import type { ProportionInputField, ProportionValidationIssue } from '../types/proportion'

const MAX_ABS_VALUE = 1_000_000_000

function validateNumber(field: ProportionInputField, value: number): ProportionValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `proportion.validation.${field}.required` }
  }

  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { field, messageKey: `proportion.validation.${field}.range` }
  }

  return null
}

export function useProportionCalculator() {
  const knownLeft = ref(5)
  const knownRight = ref(20)
  const targetLeft = ref(8)

  const issues = computed<ProportionValidationIssue[]>(() => {
    const nextIssues: ProportionValidationIssue[] = []
    const knownLeftIssue = validateNumber('knownLeft', knownLeft.value)
    const knownRightIssue = validateNumber('knownRight', knownRight.value)
    const targetLeftIssue = validateNumber('targetLeft', targetLeft.value)

    if (knownLeftIssue) nextIssues.push(knownLeftIssue)
    if (knownRightIssue) nextIssues.push(knownRightIssue)
    if (targetLeftIssue) nextIssues.push(targetLeftIssue)

    if (!knownLeftIssue && knownLeft.value === 0) {
      nextIssues.push({ field: 'knownLeft', messageKey: 'proportion.validation.knownLeft.nonZero' })
    }

    return nextIssues
  })

  const result = computed(() => {
    if (issues.value.length > 0) {
      return null
    }

    return calculateProportion(knownLeft.value, knownRight.value, targetLeft.value)
  })

  function getIssue(field: ProportionInputField): ProportionValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    knownLeft,
    knownRight,
    targetLeft,
    issues,
    result,
    getIssue,
  }
}
