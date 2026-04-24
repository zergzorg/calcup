import { computed, ref } from 'vue'
import { convertLength, isValidLengthValue, LENGTH_UNITS } from '../lib/calculations'
import type { LengthUnit, LengthValidationIssue } from '../types/length'

export function useLengthConverter() {
  const value = ref(1)
  const fromUnit = ref<LengthUnit>('meter')
  const toUnit = ref<LengthUnit>('centimeter')

  const issue = computed<LengthValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { field: 'value', messageKey: 'length.validation.value.required' }
    }

    if (!isValidLengthValue(value.value)) {
      return { field: 'value', messageKey: 'length.validation.value.nonNegative' }
    }

    return null
  })

  const result = computed(() =>
    issue.value
      ? null
      : convertLength(value.value, fromUnit.value, toUnit.value),
  )

  function swapUnits() {
    const nextFrom = toUnit.value
    toUnit.value = fromUnit.value
    fromUnit.value = nextFrom
  }

  return {
    value,
    fromUnit,
    toUnit,
    units: LENGTH_UNITS.map(item => item.unit),
    issue,
    result,
    swapUnits,
  }
}
