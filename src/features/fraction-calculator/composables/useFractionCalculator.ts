import { computed, ref } from 'vue'
import { calculateFractions } from '../lib/calculations'
import type { FractionInputField, FractionOperator, FractionValidationIssue } from '../types/fraction'

const MAX_ABS_INTEGER = 1_000_000

function validateInteger(field: FractionInputField, value: number): FractionValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `fraction.validation.${field}.required` }
  }

  if (!Number.isInteger(value)) {
    return { field, messageKey: `fraction.validation.${field}.integer` }
  }

  if (Math.abs(value) > MAX_ABS_INTEGER) {
    return { field, messageKey: `fraction.validation.${field}.range` }
  }

  return null
}

export function useFractionCalculator() {
  const operator = ref<FractionOperator>('add')
  const leftNumerator = ref(1)
  const leftDenominator = ref(2)
  const rightNumerator = ref(1)
  const rightDenominator = ref(3)

  const issues = computed<FractionValidationIssue[]>(() => {
    const nextIssues: FractionValidationIssue[] = []

    const fields: Array<[FractionInputField, number]> = [
      ['leftNumerator', leftNumerator.value],
      ['leftDenominator', leftDenominator.value],
      ['rightNumerator', rightNumerator.value],
      ['rightDenominator', rightDenominator.value],
    ]

    fields.forEach(([field, value]) => {
      const issue = validateInteger(field, value)
      if (issue) nextIssues.push(issue)
    })

    if (!nextIssues.some(issue => issue.field === 'leftDenominator') && leftDenominator.value === 0) {
      nextIssues.push({ field: 'leftDenominator', messageKey: 'fraction.validation.denominator.nonZero' })
    }

    if (!nextIssues.some(issue => issue.field === 'rightDenominator') && rightDenominator.value === 0) {
      nextIssues.push({ field: 'rightDenominator', messageKey: 'fraction.validation.denominator.nonZero' })
    }

    if (
      operator.value === 'divide'
      && !nextIssues.some(issue => issue.field === 'rightNumerator')
      && rightNumerator.value === 0
    ) {
      nextIssues.push({ field: 'rightNumerator', messageKey: 'fraction.validation.divisionByZero' })
    }

    return nextIssues
  })

  const result = computed(() => {
    if (issues.value.length > 0) {
      return null
    }

    return calculateFractions(
      { numerator: leftNumerator.value, denominator: leftDenominator.value },
      { numerator: rightNumerator.value, denominator: rightDenominator.value },
      operator.value,
    )
  })

  function getIssue(field: FractionInputField): FractionValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    operator,
    leftNumerator,
    leftDenominator,
    rightNumerator,
    rightDenominator,
    issues,
    result,
    getIssue,
  }
}
