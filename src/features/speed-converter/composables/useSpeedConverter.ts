import { computed, ref } from 'vue'
import { convertSpeed, SPEED_UNITS } from '../lib/calculations'
import type { SpeedUnit, SpeedValidationIssue } from '../types/speed'

export function useSpeedConverter() {
  const value = ref(10)
  const fromUnit = ref<SpeedUnit>('kilometerPerHour')
  const toUnit = ref<SpeedUnit>('meterPerSecond')

  const issue = computed<SpeedValidationIssue | null>(() => {
    if (!Number.isFinite(value.value)) {
      return { messageKey: 'speed.validation.value.required' }
    }

    if (value.value < 0) {
      return { messageKey: 'speed.validation.value.nonNegative' }
    }

    if ((fromUnit.value === 'minutePerKilometer' || toUnit.value === 'minutePerKilometer') && value.value === 0) {
      return { messageKey: 'speed.validation.value.positiveForPace' }
    }

    return null
  })

  const result = computed(() => {
    if (issue.value) {
      return null
    }

    return convertSpeed(value.value, fromUnit.value, toUnit.value)
  })

  const metersPerSecondValue = computed(() => convertSpeed(value.value, fromUnit.value, 'meterPerSecond') ?? 0)

  function swapUnits() {
    const nextFrom = toUnit.value
    toUnit.value = fromUnit.value
    fromUnit.value = nextFrom
  }

  return {
    value,
    fromUnit,
    toUnit,
    units: SPEED_UNITS,
    issue,
    result,
    metersPerSecondValue,
    swapUnits,
  }
}
