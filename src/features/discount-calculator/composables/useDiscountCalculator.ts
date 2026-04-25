import { ref, computed } from 'vue'
import type { DiscountMode, DiscountValidationIssue } from '../types/discount'
import { calcDiscount, calcMarkup, calcFindPercent, calcFindOriginal } from '../lib/calculations'

export const QUICK_PERCENTS = [5, 10, 15, 20, 25, 50] as const

export function useDiscountCalculator() {
  const mode = ref<DiscountMode>('discount')

  // Shared fields for discount/markup/findOriginal modes
  const originalPrice = ref<number>(1000)
  const percent = ref<number | 'custom'>(10)
  const customPercent = ref<number>(15)

  // findPercent mode fields
  const oldPrice = ref<number>(1000)
  const newPrice = ref<number>(900)

  // findOriginal mode field
  const finalPrice = ref<number>(900)

  const touched = new Set<string>()
  function touch(field: string) { touched.add(field) }

  const effectivePercent = computed<number>(() =>
    percent.value === 'custom' ? customPercent.value : (percent.value as number),
  )

  function getIssue(field: string): DiscountValidationIssue | undefined {
    if (!touched.has(field)) return undefined

    if (field === 'originalPrice') {
      const v = originalPrice.value
      if (!Number.isFinite(v)) return { field, messageKey: 'discount.validation.originalPrice.required' }
      if (v < 0) return { field, messageKey: 'discount.validation.originalPrice.nonNegative' }
    }
    if (field === 'percent') {
      const v = effectivePercent.value
      if (!Number.isFinite(v)) return { field, messageKey: 'discount.validation.percent.required' }
      if (v < 0) return { field, messageKey: 'discount.validation.percent.nonNegative' }
      if (mode.value === 'findOriginal' && v >= 100) return { field, messageKey: 'discount.validation.percent.lessThan100' }
    }
    if (field === 'oldPrice') {
      const v = oldPrice.value
      if (!Number.isFinite(v)) return { field, messageKey: 'discount.validation.oldPrice.required' }
      if (v <= 0) return { field, messageKey: 'discount.validation.oldPrice.positive' }
    }
    if (field === 'newPrice') {
      const v = newPrice.value
      if (!Number.isFinite(v)) return { field, messageKey: 'discount.validation.newPrice.required' }
      if (v < 0) return { field, messageKey: 'discount.validation.newPrice.nonNegative' }
    }
    if (field === 'finalPrice') {
      const v = finalPrice.value
      if (!Number.isFinite(v)) return { field, messageKey: 'discount.validation.finalPrice.required' }
      if (v < 0) return { field, messageKey: 'discount.validation.finalPrice.nonNegative' }
    }
    return undefined
  }

  const result = computed(() => {
    switch (mode.value) {
      case 'discount': return calcDiscount(originalPrice.value, effectivePercent.value)
      case 'markup': return calcMarkup(originalPrice.value, effectivePercent.value)
      case 'findPercent': return calcFindPercent(oldPrice.value, newPrice.value)
      case 'findOriginal': return calcFindOriginal(finalPrice.value, effectivePercent.value)
    }
  })

  return {
    mode,
    originalPrice,
    percent,
    customPercent,
    oldPrice,
    newPrice,
    finalPrice,
    effectivePercent,
    QUICK_PERCENTS,
    touch,
    getIssue,
    result,
  }
}
