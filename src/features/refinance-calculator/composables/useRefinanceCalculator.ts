import { computed, ref } from 'vue'
import { calculateRefinance } from '../lib/calculations'
import type { RefinanceInputField, RefinanceValidationIssue } from '../types/refinance'

const FIELD_RANGES: Record<RefinanceInputField, { min: number; max: number }> = {
  outstandingBalance: { min: 1_000, max: 1_000_000_000 },
  oldAnnualRate: { min: 0, max: 100 },
  oldTermMonths: { min: 1, max: 600 },
  newAnnualRate: { min: 0, max: 100 },
  newTermMonths: { min: 1, max: 600 },
  refinancingCost: { min: 0, max: 100_000_000 },
}

function validateNumber(field: RefinanceInputField, value: number): RefinanceValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `refinance.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `refinance.validation.${field}.range` }
  }

  return null
}

export function useRefinanceCalculator() {
  const outstandingBalance = ref(1_000_000)
  const oldAnnualRate = ref(16)
  const oldTermMonths = ref(36)
  const newAnnualRate = ref(12)
  const newTermMonths = ref(36)
  const refinancingCost = ref(15_000)

  const issues = computed<RefinanceValidationIssue[]>(() =>
    ([
      ['outstandingBalance', outstandingBalance.value],
      ['oldAnnualRate', oldAnnualRate.value],
      ['oldTermMonths', oldTermMonths.value],
      ['newAnnualRate', newAnnualRate.value],
      ['newTermMonths', newTermMonths.value],
      ['refinancingCost', refinancingCost.value],
    ] satisfies Array<[RefinanceInputField, number]>)
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is RefinanceValidationIssue => Boolean(issue)),
  )

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateRefinance({
      outstandingBalance: outstandingBalance.value,
      oldAnnualRate: oldAnnualRate.value,
      oldTermMonths: oldTermMonths.value,
      newAnnualRate: newAnnualRate.value,
      newTermMonths: newTermMonths.value,
      refinancingCost: refinancingCost.value,
    })
  })

  function getIssue(field: RefinanceInputField): RefinanceValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    outstandingBalance,
    oldAnnualRate,
    oldTermMonths,
    newAnnualRate,
    newTermMonths,
    refinancingCost,
    issues,
    result,
    getIssue,
  }
}
