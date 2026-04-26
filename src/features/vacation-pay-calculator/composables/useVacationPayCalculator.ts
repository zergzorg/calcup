import { computed, ref } from 'vue'
import { calculateVacationPay, isValidNonNegativeNumber, isValidPositiveNumber } from '../lib/calculations'
import type { VacationPayInput, VacationPayValidationIssue } from '../types/vacation-pay'

export function useVacationPayCalculator() {
  const earnings = ref(1_200_000)
  const fullMonths = ref(12)
  const partialMonthDays = ref(0)
  const vacationDays = ref(14)
  const taxPercent = ref(13)

  const touched = ref(new Set<VacationPayValidationIssue['field']>())

  const input = computed<VacationPayInput>(() => ({
    earnings: earnings.value,
    fullMonths: fullMonths.value,
    partialMonthDays: partialMonthDays.value,
    vacationDays: vacationDays.value,
    taxPercent: taxPercent.value,
  }))

  const issues = computed<VacationPayValidationIssue[]>(() => {
    const result: VacationPayValidationIssue[] = []

    if (!Number.isFinite(earnings.value)) {
      result.push({ field: 'earnings', messageKey: 'vacationPay.validation.earnings.required' })
    } else if (!isValidPositiveNumber(earnings.value)) {
      result.push({ field: 'earnings', messageKey: 'vacationPay.validation.earnings.positive' })
    }

    if (!Number.isFinite(fullMonths.value)) {
      result.push({ field: 'fullMonths', messageKey: 'vacationPay.validation.fullMonths.required' })
    } else if (!isValidNonNegativeNumber(fullMonths.value) || fullMonths.value > 12) {
      result.push({ field: 'fullMonths', messageKey: 'vacationPay.validation.fullMonths.range' })
    }

    if (!Number.isFinite(partialMonthDays.value)) {
      result.push({ field: 'partialMonthDays', messageKey: 'vacationPay.validation.partialMonthDays.required' })
    } else if (!isValidNonNegativeNumber(partialMonthDays.value) || partialMonthDays.value > 31) {
      result.push({ field: 'partialMonthDays', messageKey: 'vacationPay.validation.partialMonthDays.range' })
    }

    if (!Number.isFinite(vacationDays.value)) {
      result.push({ field: 'vacationDays', messageKey: 'vacationPay.validation.vacationDays.required' })
    } else if (!isValidPositiveNumber(vacationDays.value)) {
      result.push({ field: 'vacationDays', messageKey: 'vacationPay.validation.vacationDays.positive' })
    }

    if (!Number.isFinite(taxPercent.value)) {
      result.push({ field: 'taxPercent', messageKey: 'vacationPay.validation.taxPercent.required' })
    } else if (!isValidNonNegativeNumber(taxPercent.value) || taxPercent.value > 100) {
      result.push({ field: 'taxPercent', messageKey: 'vacationPay.validation.taxPercent.range' })
    }

    if (
      Number.isFinite(fullMonths.value) &&
      Number.isFinite(partialMonthDays.value) &&
      fullMonths.value === 0 &&
      partialMonthDays.value === 0
    ) {
      result.push({ field: 'partialMonthDays', messageKey: 'vacationPay.validation.accountingDays.positive' })
    }

    return result
  })

  const result = computed(() => {
    if (issues.value.length > 0) return null
    return calculateVacationPay(input.value)
  })

  function touch(field: VacationPayValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function getIssue(field: VacationPayValidationIssue['field']) {
    if (!touched.value.has(field)) return undefined
    return issues.value.find(issue => issue.field === field)
  }

  return {
    earnings,
    fullMonths,
    partialMonthDays,
    vacationDays,
    taxPercent,
    issues,
    result,
    touch,
    getIssue,
  }
}
