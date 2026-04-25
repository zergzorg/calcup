import { computed, reactive } from 'vue'
import { calculateAverageSpeed, isNonNegative, isPositive } from '../lib/calculations'
import type { AverageSpeedInput, AverageSpeedInputField, AverageSpeedValidationIssue } from '../types/average-speed'

export function useAverageSpeedCalculator() {
  const input = reactive<AverageSpeedInput>({
    distanceKm: 120,
    hours: 1,
    minutes: 30,
  })

  const issues = computed<AverageSpeedValidationIssue[]>(() => {
    const next: AverageSpeedValidationIssue[] = []

    if (!isPositive(input.distanceKm)) next.push({ field: 'distanceKm', messageKey: 'averageSpeed.validation.distanceKm.positive' })
    if (!isNonNegative(input.hours)) next.push({ field: 'hours', messageKey: 'averageSpeed.validation.hours.nonNegative' })
    if (!isNonNegative(input.minutes)) next.push({ field: 'minutes', messageKey: 'averageSpeed.validation.minutes.nonNegative' })
    if (isNonNegative(input.hours) && isNonNegative(input.minutes) && !isPositive(input.hours * 60 + input.minutes)) {
      next.push({ field: 'minutes', messageKey: 'averageSpeed.validation.duration.positive' })
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateAverageSpeed(input),
  )

  function getIssue(field: AverageSpeedInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    input,
    result,
    getIssue,
  }
}
