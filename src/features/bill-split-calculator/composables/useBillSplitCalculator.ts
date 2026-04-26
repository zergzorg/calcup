import { computed, reactive, ref } from 'vue'
import { calculateBillSplit, ROUNDING_PRESETS, TIP_PRESETS } from '../lib/calculations'
import type { BillSplitInput, BillSplitInputField, BillSplitValidationIssue } from '../types/bill-split'

export { ROUNDING_PRESETS, TIP_PRESETS }

export function useBillSplitCalculator() {
  const input = reactive<BillSplitInput>({
    billAmount: 3500,
    peopleCount: 4,
    tipPercent: 10,
    serviceFee: 0,
    roundTo: 1,
  })

  const touched = ref(new Set<BillSplitInputField>())

  function touch(field: BillSplitInputField) {
    touched.value.add(field)
  }

  const allIssues = computed<BillSplitValidationIssue[]>(() => {
    const issues: BillSplitValidationIssue[] = []

    if (!Number.isFinite(input.billAmount) || input.billAmount < 0) {
      issues.push({ field: 'billAmount', messageKey: 'billSplit.validation.billAmount' })
    }

    if (!Number.isInteger(input.peopleCount) || input.peopleCount < 1) {
      issues.push({ field: 'peopleCount', messageKey: 'billSplit.validation.peopleCount' })
    }

    if (!Number.isFinite(input.tipPercent) || input.tipPercent < 0) {
      issues.push({ field: 'tipPercent', messageKey: 'billSplit.validation.tipPercent' })
    }

    if (!Number.isFinite(input.serviceFee) || input.serviceFee < 0) {
      issues.push({ field: 'serviceFee', messageKey: 'billSplit.validation.serviceFee' })
    }

    if (!Number.isFinite(input.roundTo) || input.roundTo <= 0) {
      issues.push({ field: 'roundTo', messageKey: 'billSplit.validation.roundTo' })
    }

    return issues
  })

  function getIssue(field: BillSplitInputField): BillSplitValidationIssue | undefined {
    if (!touched.value.has(field)) {
      return undefined
    }

    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) {
      return null
    }

    return calculateBillSplit(input)
  })

  return {
    input,
    result,
    touch,
    getIssue,
  }
}
