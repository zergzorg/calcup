import { computed, ref } from 'vue'
import { calculateDeposit } from '../lib/calculations'
import type { DepositInputField, DepositInterestMode, DepositValidationIssue } from '../types/deposit'

const FIELD_RANGES: Record<DepositInputField, { min: number; max: number }> = {
  initialAmount: { min: 1_000, max: 1_000_000_000 },
  annualRate: { min: 0, max: 100 },
  termMonths: { min: 1, max: 600 },
}

function validateNumber(field: DepositInputField, value: number): DepositValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `deposit.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `deposit.validation.${field}.range` }
  }

  return null
}

export function useDepositCalculator() {
  const initialAmount = ref(1_000_000)
  const annualRate = ref(12)
  const termMonths = ref(12)
  const mode = ref<DepositInterestMode>('monthlyCapitalization')

  const issues = computed<DepositValidationIssue[]>(() =>
    ([
      ['initialAmount', initialAmount.value],
      ['annualRate', annualRate.value],
      ['termMonths', termMonths.value],
    ] satisfies Array<[DepositInputField, number]>)
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is DepositValidationIssue => Boolean(issue)),
  )

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateDeposit({
      initialAmount: initialAmount.value,
      annualRate: annualRate.value,
      termMonths: termMonths.value,
      mode: mode.value,
    })
  })

  function getIssue(field: DepositInputField): DepositValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    initialAmount,
    annualRate,
    termMonths,
    mode,
    issues,
    result,
    getIssue,
  }
}
