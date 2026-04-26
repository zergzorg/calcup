import { computed, ref } from 'vue'
import { convertVolume, VOLUME_UNITS } from '../lib/calculations'
import type { VolumeUnit, VolumeValidationIssue } from '../types/volume'

export function useVolumeConverter() {
  const value = ref(1)
  const fromUnit = ref<VolumeUnit>('liter')
  const toUnit = ref<VolumeUnit>('milliliter')

  const issue = computed<VolumeValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { messageKey: 'volume.validation.value.required' }
    }

    if (value.value < 0) {
      return { messageKey: 'volume.validation.value.nonNegative' }
    }

    return null
  })

  const result = computed(() => {
    if (issue.value) {
      return null
    }

    return convertVolume(value.value, fromUnit.value, toUnit.value)
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
    units: VOLUME_UNITS,
    issue,
    result,
    swapUnits,
  }
}
