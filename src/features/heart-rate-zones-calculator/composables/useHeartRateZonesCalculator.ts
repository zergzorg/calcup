import { computed, ref } from 'vue'
import { calculateHeartRateZones, estimateMaxHeartRate, isValidHeartRate } from '../lib/calculations'
import type { HeartRateValidationIssue, HeartRateZoneMethod } from '../types/heart-rate-zones'

export function useHeartRateZonesCalculator() {
  const age = ref(40)
  const maxHeartRate = ref<number | null>(null)
  const restingHeartRate = ref(60)
  const method = ref<HeartRateZoneMethod>('max')

  const issues = computed<HeartRateValidationIssue[]>(() => {
    const next: HeartRateValidationIssue[] = []
    if (estimateMaxHeartRate(age.value) === null) {
      next.push({ field: 'age', messageKey: 'heartRateZones.validation.age.range' })
    }

    if (maxHeartRate.value !== null && !isValidHeartRate(maxHeartRate.value, 80, 240)) {
      next.push({ field: 'maxHeartRate', messageKey: 'heartRateZones.validation.maxHeartRate.range' })
    }

    if (method.value === 'reserve') {
      if (!isValidHeartRate(restingHeartRate.value, 30, 120)) {
        next.push({ field: 'restingHeartRate', messageKey: 'heartRateZones.validation.restingHeartRate.range' })
      }

      const effectiveMax = maxHeartRate.value ?? estimateMaxHeartRate(age.value)
      if (effectiveMax !== null && restingHeartRate.value >= effectiveMax) {
        next.push({ field: 'restingHeartRate', messageKey: 'heartRateZones.validation.restingHeartRate.belowMax' })
      }
    }

    return next
  })

  const result = computed(() =>
    issues.value.length
      ? null
      : calculateHeartRateZones({
        age: age.value,
        maxHeartRate: maxHeartRate.value,
        restingHeartRate: restingHeartRate.value,
        method: method.value,
      }),
  )

  function getIssue(field: HeartRateValidationIssue['field']) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    age,
    maxHeartRate,
    restingHeartRate,
    method,
    result,
    getIssue,
  }
}
