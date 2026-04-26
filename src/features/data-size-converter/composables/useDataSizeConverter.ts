import { computed, ref, watch } from 'vue'
import { convertDataSize, getDataSizeUnits } from '../lib/calculations'
import type { DataSizeMode, DataSizeUnit, DataSizeValidationIssue } from '../types/data-size'

export function useDataSizeConverter() {
  const value = ref(1)
  const mode = ref<DataSizeMode>('decimal')
  const fromUnit = ref<DataSizeUnit>('gigabyte')
  const toUnit = ref<DataSizeUnit>('megabyte')

  const units = computed(() => getDataSizeUnits(mode.value))

  watch(mode, (nextMode) => {
    if (nextMode === 'binary') {
      fromUnit.value = mapToBinaryUnit(fromUnit.value)
      toUnit.value = mapToBinaryUnit(toUnit.value)
      return
    }

    fromUnit.value = mapToDecimalUnit(fromUnit.value)
    toUnit.value = mapToDecimalUnit(toUnit.value)
  })

  const issue = computed<DataSizeValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { messageKey: 'dataSize.validation.value.required' }
    }

    if (value.value < 0) {
      return { messageKey: 'dataSize.validation.value.nonNegative' }
    }

    return null
  })

  const result = computed(() => {
    if (issue.value) {
      return null
    }

    return convertDataSize(value.value, fromUnit.value, toUnit.value)
  })

  const bytesValue = computed(() => {
    if (issue.value) {
      return null
    }

    return convertDataSize(value.value, fromUnit.value, 'byte')
  })

  function swapUnits() {
    const nextFrom = toUnit.value
    toUnit.value = fromUnit.value
    fromUnit.value = nextFrom
  }

  return {
    value,
    mode,
    fromUnit,
    toUnit,
    units,
    issue,
    result,
    bytesValue,
    swapUnits,
  }
}

function mapToBinaryUnit(unit: DataSizeUnit): DataSizeUnit {
  const map: Record<DataSizeUnit, DataSizeUnit> = {
    byte: 'byte',
    kilobyte: 'kibibyte',
    megabyte: 'mebibyte',
    gigabyte: 'gibibyte',
    terabyte: 'tebibyte',
    kibibyte: 'kibibyte',
    mebibyte: 'mebibyte',
    gibibyte: 'gibibyte',
    tebibyte: 'tebibyte',
  }

  return map[unit]
}

function mapToDecimalUnit(unit: DataSizeUnit): DataSizeUnit {
  const map: Record<DataSizeUnit, DataSizeUnit> = {
    byte: 'byte',
    kilobyte: 'kilobyte',
    megabyte: 'megabyte',
    gigabyte: 'gigabyte',
    terabyte: 'terabyte',
    kibibyte: 'kilobyte',
    mebibyte: 'megabyte',
    gibibyte: 'gigabyte',
    tebibyte: 'terabyte',
  }

  return map[unit]
}
