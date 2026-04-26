import { computed, ref } from 'vue'
import { calculateCompoundInterest } from '../lib/calculations'
import type { CompoundInterestInputField, CompoundInterestValidationIssue } from '../types/compoundInterest'

const FIELD_RANGES: Record<CompoundInterestInputField, { min: number; max: number }> = {
  initialAmount: { min: 0, max: 1_000_000_000 },
  monthlyContribution: { min: 0, max: 100_000_000 },
  annualRate: { min: 0, max: 100 },
  termYears: { min: 1, max: 60 },
}

function validateNumber(field: CompoundInterestInputField, value: number): CompoundInterestValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `compoundInterest.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `compoundInterest.validation.${field}.range` }
  }

  return null
}

export function useCompoundInterestCalculator() {
  const initialAmount = ref(100_000)
  const monthlyContribution = ref(10_000)
  const annualRate = ref(10)
  const termYears = ref(10)

  const issues = computed<CompoundInterestValidationIssue[]>(() =>
    ([
      ['initialAmount', initialAmount.value],
      ['monthlyContribution', monthlyContribution.value],
      ['annualRate', annualRate.value],
      ['termYears', termYears.value],
    ] satisfies Array<[CompoundInterestInputField, number]>)
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is CompoundInterestValidationIssue => Boolean(issue)),
  )

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateCompoundInterest({
      initialAmount: initialAmount.value,
      monthlyContribution: monthlyContribution.value,
      annualRate: annualRate.value,
      termYears: termYears.value,
    })
  })

  function getIssue(field: CompoundInterestInputField): CompoundInterestValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    initialAmount,
    monthlyContribution,
    annualRate,
    termYears,
    issues,
    result,
    getIssue,
  }
}
