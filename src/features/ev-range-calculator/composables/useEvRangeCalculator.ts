import { computed, reactive } from 'vue'
import { calculateEvRange, isNonNegative, isPercent, isPositive } from '../lib/calculations'
import type { EvRangeInput, EvRangeInputField, EvRangeValidationIssue } from '../types/ev-range'

export function useEvRangeCalculator() {
  const input = reactive<EvRangeInput>({
    batteryCapacityKwh: 75,
    currentChargePercent: 80,
    targetChargePercent: 100,
    consumptionKwhPer100Km: 18,
    reservePercent: 10,
    electricityPrice: 6,
  })

  const issues = computed<EvRangeValidationIssue[]>(() => {
    const next: EvRangeValidationIssue[] = []

    for (const field of ['batteryCapacityKwh', 'consumptionKwhPer100Km'] as EvRangeInputField[]) {
      if (!isPositive(input[field])) next.push({ field, messageKey: `evRange.validation.${field}.positive` })
    }

    for (const field of ['currentChargePercent', 'targetChargePercent', 'reservePercent'] as EvRangeInputField[]) {
      if (!isPercent(input[field])) next.push({ field, messageKey: `evRange.validation.${field}.percent` })
    }

    if (!isNonNegative(input.electricityPrice)) {
      next.push({ field: 'electricityPrice', messageKey: 'evRange.validation.electricityPrice.nonNegative' })
    }

    if (isPercent(input.currentChargePercent) && isPercent(input.reservePercent) && input.reservePercent >= input.currentChargePercent) {
      next.push({ field: 'reservePercent', messageKey: 'evRange.validation.reservePercent.belowCurrent' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateEvRange(input),
  )

  function getIssue(field: EvRangeInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function setCurrentCharge(value: number) {
    input.currentChargePercent = value
  }

  function setReserve(value: number) {
    input.reservePercent = value
  }

  return {
    input,
    result,
    getIssue,
    setCurrentCharge,
    setReserve,
  }
}
