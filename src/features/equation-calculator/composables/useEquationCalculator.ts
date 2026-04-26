import { computed, ref } from 'vue'
import { solveLinearEquation, solveQuadraticEquation } from '../lib/calculations'
import type { EquationInputField, EquationMode, EquationValidationIssue } from '../types/equation'

const MAX_ABS_VALUE = 1_000_000

function validateNumber(field: EquationInputField, value: number): EquationValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `equation.validation.${field}.required` }
  }

  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { field, messageKey: `equation.validation.${field}.range` }
  }

  return null
}

export function useEquationCalculator() {
  const mode = ref<EquationMode>('quadratic')
  const linearA = ref(2)
  const linearB = ref(-8)
  const quadraticA = ref(1)
  const quadraticB = ref(-5)
  const quadraticC = ref(6)

  const issues = computed<EquationValidationIssue[]>(() => {
    const fields: Array<[EquationInputField, number]> = mode.value === 'linear'
      ? [['linearA', linearA.value], ['linearB', linearB.value]]
      : [['quadraticA', quadraticA.value], ['quadraticB', quadraticB.value], ['quadraticC', quadraticC.value]]

    return fields
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is EquationValidationIssue => Boolean(issue))
  })

  const result = computed(() => {
    if (issues.value.length > 0) {
      return null
    }

    if (mode.value === 'linear') {
      return solveLinearEquation(linearA.value, linearB.value)
    }

    return solveQuadraticEquation(quadraticA.value, quadraticB.value, quadraticC.value)
  })

  function getIssue(field: EquationInputField): EquationValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    mode,
    linearA,
    linearB,
    quadraticA,
    quadraticB,
    quadraticC,
    issues,
    result,
    getIssue,
  }
}
