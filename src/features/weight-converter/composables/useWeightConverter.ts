import { ref, computed } from 'vue'
import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { WeightUnit, WeightValidationIssue } from '../types/weight'
import { convertWeight, isValidWeightValue, formatWeight, getFormula } from '../lib/calculations'

export const UNITS = CONVERSION_UNITS_CONFIG.weight.units.map(item => item.unit as WeightUnit)

export function useWeightConverter() {
  const value = ref<number | ''>(1)
  const fromUnit = ref<WeightUnit>('kilogram')
  const toUnit = ref<WeightUnit>('gram')
  const touched = ref<Record<string, boolean>>({})

  const result = computed(() => {
    const raw = value.value
    if (raw === '' || raw === undefined || raw === null) {
      return null
    }
    const num = Number(raw)
    if (!Number.isFinite(num)) {
      return null
    }
    const converted = convertWeight(num, fromUnit.value, toUnit.value)
    return formatWeight(converted)
  })

  const formula = computed(() => {
    return getFormula(fromUnit.value, toUnit.value)
  })

  const issue = computed((): WeightValidationIssue | null => {
    const raw = value.value
    if (raw === '' || raw === undefined || raw === null) {
      return null
    }
    const num = Number(raw)
    if (!Number.isFinite(num)) {
      return { field: 'value', messageKey: 'weight.errors.invalid' }
    }
    if (!isValidWeightValue(num)) {
      return { field: 'value', messageKey: 'weight.errors.negative' }
    }
    return null
  })

  function touch(field: string) {
    touched.value[field] = true
  }

  function getIssue(field: string): WeightValidationIssue | null {
    if (field !== 'value') return null
    if (!touched.value.value) return null
    return issue.value
  }

  function swapUnits() {
    const temp = fromUnit.value
    fromUnit.value = toUnit.value
    toUnit.value = temp
  }

  return {
    value,
    fromUnit,
    toUnit,
    result,
    formula,
    issue,
    touched,
    touch,
    getIssue,
    swapUnits,
    UNITS,
  }
}
