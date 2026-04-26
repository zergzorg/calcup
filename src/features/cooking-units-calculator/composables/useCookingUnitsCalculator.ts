import { computed, ref } from 'vue'
import { convertCookingUnit, COOKING_UNITS } from '../lib/calculations'
import type { CookingUnit, CookingUnitsValidationIssue } from '../types/cooking-units'

export function useCookingUnitsCalculator() {
  const value = ref(1)
  const fromUnit = ref<CookingUnit>('cup')
  const toUnit = ref<CookingUnit>('milliliter')

  const issue = computed<CookingUnitsValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { messageKey: 'cookingUnits.validation.value.required' }
    }

    if (value.value < 0) {
      return { messageKey: 'cookingUnits.validation.value.nonNegative' }
    }

    return null
  })

  const result = computed(() => {
    if (issue.value) {
      return null
    }

    return convertCookingUnit(value.value, fromUnit.value, toUnit.value)
  })

  const milliliterValue = computed(() => {
    if (issue.value) {
      return null
    }

    return convertCookingUnit(value.value, fromUnit.value, 'milliliter')
  })

  function swapUnits() {
    const nextFrom = toUnit.value
    toUnit.value = fromUnit.value
    fromUnit.value = nextFrom
  }

  return {
    value,
    fromUnit,
    toUnit,
    units: COOKING_UNITS,
    issue,
    result,
    milliliterValue,
    swapUnits,
  }
}
