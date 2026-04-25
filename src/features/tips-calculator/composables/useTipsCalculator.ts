import { ref, computed } from 'vue'
import { calculateTips } from '../lib/calculations'
import type { TipValidationIssue } from '../types/tips'

export const PRESET_RATES = [0, 5, 10, 15, 20] as const

export function useTipsCalculator() {
  const billAmount = ref<number>(1000)
  const presetRate = ref<number | 'custom'>(10)
  const customRate = ref<number>(12)
  const peopleCount = ref<number>(2)

  const touched = new Set<string>()

  function touch(field: string) {
    touched.add(field)
  }

  const effectiveRate = computed<number>(() =>
    presetRate.value === 'custom' ? customRate.value : (presetRate.value as number),
  )

  function getIssue(field: 'billAmount' | 'tipPercent' | 'peopleCount'): TipValidationIssue | undefined {
    if (!touched.has(field)) return undefined

    if (field === 'billAmount') {
      const v = billAmount.value
      if (!Number.isFinite(v)) return { field, messageKey: 'tips.validation.billAmount.required' }
      if (v < 0) return { field, messageKey: 'tips.validation.billAmount.nonNegative' }
    }
    if (field === 'tipPercent') {
      const v = effectiveRate.value
      if (!Number.isFinite(v)) return { field, messageKey: 'tips.validation.tipPercent.required' }
      if (v < 0) return { field, messageKey: 'tips.validation.tipPercent.nonNegative' }
    }
    if (field === 'peopleCount') {
      const v = peopleCount.value
      if (!Number.isFinite(v) || !Number.isInteger(v)) return { field, messageKey: 'tips.validation.peopleCount.required' }
      if (v < 1) return { field, messageKey: 'tips.validation.peopleCount.positiveInteger' }
    }

    return undefined
  }

  const result = computed(() =>
    calculateTips(billAmount.value, effectiveRate.value, peopleCount.value),
  )

  return {
    billAmount,
    presetRate,
    customRate,
    peopleCount,
    effectiveRate,
    PRESET_RATES,
    touch,
    getIssue,
    result,
  }
}
