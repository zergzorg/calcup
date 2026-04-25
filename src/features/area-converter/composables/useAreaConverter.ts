import { computed, ref } from 'vue'
import { convertArea, isValidAreaValue, AREA_UNITS } from '../lib/calculations'
import type { AreaUnit, AreaValidationIssue } from '../types/area'

export function useAreaConverter() {
  const value = ref(1)
  const fromUnit = ref<AreaUnit>('squareMeter')
  const toUnit = ref<AreaUnit>('squareFoot')

  const issue = computed<AreaValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { field: 'value', messageKey: 'area.validation.value.required' }
    }
    if (!isValidAreaValue(value.value)) {
      return { field: 'value', messageKey: 'area.validation.value.nonNegative' }
    }
    return null
  })

  const result = computed(() =>
    issue.value ? null : convertArea(value.value, fromUnit.value, toUnit.value),
  )

  function swapUnits() {
    const next = toUnit.value
    toUnit.value = fromUnit.value
    fromUnit.value = next
  }

  return {
    value,
    fromUnit,
    toUnit,
    units: AREA_UNITS.map(u => u.unit),
    issue,
    result,
    swapUnits,
  }
}
