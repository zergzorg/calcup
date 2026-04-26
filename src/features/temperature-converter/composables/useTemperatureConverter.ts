import { ref, computed } from 'vue'
import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { TemperatureUnit, TemperatureValidationIssue } from '../types/temperature'
import { convertTemperature, isValidTemperature, formatTemperature, getFormula } from '../lib/calculations'

export const UNITS = CONVERSION_UNITS_CONFIG.temperature.units as TemperatureUnit[]

export function useTemperatureCalculator() {
  const value = ref<number | ''>(36.6)
  const fromUnit = ref<TemperatureUnit>('celsius')
  const toUnit = ref<TemperatureUnit>('fahrenheit')
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
    const converted = convertTemperature(num, fromUnit.value, toUnit.value)
    return formatTemperature(converted)
  })

  const formula = computed(() => {
    return getFormula(fromUnit.value, toUnit.value)
  })

  const issue = computed((): TemperatureValidationIssue | null => {
    const raw = value.value
    if (raw === '' || raw === undefined || raw === null) {
      return null
    }
    const num = Number(raw)
    if (!Number.isFinite(num)) {
      return { field: 'value', messageKey: 'temperature.errors.invalid' }
    }
    if (!isValidTemperature(num, fromUnit.value)) {
      return { field: 'value', messageKey: 'temperature.errors.belowAbsoluteZero' }
    }
    return null
  })

  function touch(field: string) {
    touched.value[field] = true
  }

  function getIssue(field: string): TemperatureValidationIssue | null {
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
