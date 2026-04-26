import { computed, ref } from 'vue'
import { calculateSelfEmployedTax, isValidNonNegativeNumber } from '../lib/calculations'
import type { SelfEmployedTaxInput, SelfEmployedTaxValidationIssue } from '../types/self-employed-tax'

export function useSelfEmployedTaxCalculator() {
  const individualIncome = ref(100_000)
  const businessIncome = ref(50_000)
  const bonusBalance = ref(10_000)
  const touched = ref(new Set<SelfEmployedTaxValidationIssue['field']>())

  const input = computed<SelfEmployedTaxInput>(() => ({
    individualIncome: individualIncome.value,
    businessIncome: businessIncome.value,
    bonusBalance: bonusBalance.value,
  }))

  const issues = computed<SelfEmployedTaxValidationIssue[]>(() => {
    const result: SelfEmployedTaxValidationIssue[] = []

    if (!Number.isFinite(individualIncome.value)) {
      result.push({ field: 'individualIncome', messageKey: 'selfEmployedTax.validation.individualIncome.required' })
    } else if (!isValidNonNegativeNumber(individualIncome.value)) {
      result.push({ field: 'individualIncome', messageKey: 'selfEmployedTax.validation.individualIncome.nonNegative' })
    }

    if (!Number.isFinite(businessIncome.value)) {
      result.push({ field: 'businessIncome', messageKey: 'selfEmployedTax.validation.businessIncome.required' })
    } else if (!isValidNonNegativeNumber(businessIncome.value)) {
      result.push({ field: 'businessIncome', messageKey: 'selfEmployedTax.validation.businessIncome.nonNegative' })
    }

    if (!Number.isFinite(bonusBalance.value)) {
      result.push({ field: 'bonusBalance', messageKey: 'selfEmployedTax.validation.bonusBalance.required' })
    } else if (!isValidNonNegativeNumber(bonusBalance.value)) {
      result.push({ field: 'bonusBalance', messageKey: 'selfEmployedTax.validation.bonusBalance.nonNegative' })
    }

    return result
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null
    return calculateSelfEmployedTax(input.value)
  })

  function touch(field: SelfEmployedTaxValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function getIssue(field: SelfEmployedTaxValidationIssue['field']) {
    if (!touched.value.has(field)) return undefined
    return issues.value.find(issue => issue.field === field)
  }

  return {
    individualIncome,
    businessIncome,
    bonusBalance,
    issues,
    result,
    touch,
    getIssue,
  }
}
