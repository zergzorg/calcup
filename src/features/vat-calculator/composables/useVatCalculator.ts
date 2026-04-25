import { computed, ref } from 'vue'
import { addVat, extractVat, isValidAmount, isValidRate } from '../lib/calculations'
import type { VatMode, VatValidationIssue } from '../types/vat'

export const PRESET_RATES = [20, 10, 0] as const

export function useVatCalculator() {
  const mode = ref<VatMode>('add')
  const amount = ref<number>(1000)
  const presetRate = ref<number | 'custom'>(20)
  const customRate = ref<number>(15)

  const touched = ref(new Set<VatValidationIssue['field']>())

  function touch(field: VatValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const effectiveRate = computed(() =>
    presetRate.value === 'custom' ? customRate.value : presetRate.value,
  )

  const allIssues = computed<VatValidationIssue[]>(() => {
    const result: VatValidationIssue[] = []
    if (!Number.isFinite(amount.value)) {
      result.push({ field: 'amount', messageKey: 'vat.validation.amount.required' })
    } else if (!isValidAmount(amount.value)) {
      result.push({ field: 'amount', messageKey: 'vat.validation.amount.nonNegative' })
    }
    if (!Number.isFinite(effectiveRate.value)) {
      result.push({ field: 'rate', messageKey: 'vat.validation.rate.required' })
    } else if (!isValidRate(effectiveRate.value)) {
      result.push({ field: 'rate', messageKey: 'vat.validation.rate.nonNegative' })
    }
    return result
  })

  function getIssue(field: VatValidationIssue['field']): VatValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(i => i.field === field)
  }

  const addResult = computed(() => {
    if (mode.value !== 'add' || allIssues.value.length > 0) return null
    return addVat(amount.value, effectiveRate.value)
  })

  const extractResult = computed(() => {
    if (mode.value !== 'extract' || allIssues.value.length > 0) return null
    return extractVat(amount.value, effectiveRate.value)
  })

  return {
    mode,
    amount,
    presetRate,
    customRate,
    effectiveRate,
    touch,
    getIssue,
    addResult,
    extractResult,
    PRESET_RATES,
  }
}
