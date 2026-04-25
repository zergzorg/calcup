import { computed, ref } from 'vue'
import { convertShoeSize, isValidShoeSizeInput, SHOE_SIZE_SYSTEMS } from '../lib/calculations'
import type { ShoeSizeSystem, ShoeSizeValidationIssue } from '../types/shoe-size'

export function useShoeSizeConverter() {
  const value = ref(26.5)
  const system = ref<ShoeSizeSystem>('cm')

  const issue = computed<ShoeSizeValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { field: 'value', messageKey: 'shoeSize.validation.value.required' }
    }

    if (!isValidShoeSizeInput(value.value, system.value)) {
      return { field: 'value', messageKey: 'shoeSize.validation.value.range' }
    }

    return null
  })

  const result = computed(() =>
    issue.value
      ? null
      : convertShoeSize(value.value, system.value),
  )

  return {
    value,
    system,
    systems: SHOE_SIZE_SYSTEMS.map(item => item.system),
    issue,
    result,
  }
}
