import { computed, reactive } from 'vue'
import { calculateRaceSplits, isNonNegativeInteger, isPositive, timeToSeconds } from '../lib/calculations'
import type { RaceSplitInput, RaceSplitInputField, RaceSplitValidationIssue } from '../types/race-split'

export function useRaceSplitCalculator() {
  const input = reactive<RaceSplitInput>({
    distanceKm: 10,
    hours: 0,
    minutes: 50,
    seconds: 0,
    splitDistanceKm: 1,
  })

  const issues = computed<RaceSplitValidationIssue[]>(() => {
    const next: RaceSplitValidationIssue[] = []

    if (!isPositive(input.distanceKm)) next.push({ field: 'distanceKm', messageKey: 'raceSplit.validation.distanceKm.positive' })
    if (!isPositive(input.splitDistanceKm)) next.push({ field: 'splitDistanceKm', messageKey: 'raceSplit.validation.splitDistanceKm.positive' })
    if (isPositive(input.distanceKm) && isPositive(input.splitDistanceKm) && input.splitDistanceKm > input.distanceKm) {
      next.push({ field: 'splitDistanceKm', messageKey: 'raceSplit.validation.splitDistanceKm.tooLarge' })
    }

    for (const field of ['hours', 'minutes', 'seconds'] as RaceSplitInputField[]) {
      if (!isNonNegativeInteger(input[field])) next.push({ field, messageKey: `raceSplit.validation.${field}.integer` })
    }

    if (isNonNegativeInteger(input.hours) && isNonNegativeInteger(input.minutes) && isNonNegativeInteger(input.seconds)) {
      if (input.minutes >= 60) next.push({ field: 'minutes', messageKey: 'raceSplit.validation.minutes.range' })
      if (input.seconds >= 60) next.push({ field: 'seconds', messageKey: 'raceSplit.validation.seconds.range' })
      if (timeToSeconds(input.hours, input.minutes, input.seconds) === null) {
        next.push({ field: 'seconds', messageKey: 'raceSplit.validation.duration.positive' })
      }
    }

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateRaceSplits(input),
  )

  function getIssue(field: RaceSplitInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    input,
    result,
    getIssue,
  }
}
