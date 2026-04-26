import { computed, ref } from 'vue'
import { CALCULATOR_PRESETS_CONFIG } from '../../../config'
import {
  calculateDistanceByTimeAndPace,
  calculatePaceByDistanceAndTime,
  calculateTimeByDistanceAndPace,
} from '../lib/calculations'
import type { DistancePaceTimeMode, DistancePaceTimeValidationIssue } from '../types/distance-pace-time'

export const DISTANCE_PRESETS = CALCULATOR_PRESETS_CONFIG.distancePaceTime.distancePresetsKm

export function useDistancePaceTimeCalculator() {
  const mode = ref<DistancePaceTimeMode>('time')
  const distanceKm = ref(10)
  const timeHours = ref(0)
  const timeMinutes = ref(50)
  const timeSeconds = ref(0)
  const paceMinutes = ref(5)
  const paceSeconds = ref(0)
  const touched = ref(new Set<DistancePaceTimeValidationIssue['field']>())

  function touch(field: DistancePaceTimeValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function setDistance(value: number) {
    distanceKm.value = value
  }

  const allIssues = computed<DistancePaceTimeValidationIssue[]>(() => {
    const issues: DistancePaceTimeValidationIssue[] = []

    if (mode.value === 'time' || mode.value === 'pace') {
      positiveNumberField(issues, 'distanceKm', distanceKm.value)
    }

    if (mode.value === 'pace' || mode.value === 'distance') {
      timeField(issues, 'timeHours', timeHours.value, 0, Number.POSITIVE_INFINITY)
      timeField(issues, 'timeMinutes', timeMinutes.value, 0, 59)
      timeField(issues, 'timeSeconds', timeSeconds.value, 0, 59)

      if (
        Number.isInteger(timeHours.value)
        && Number.isInteger(timeMinutes.value)
        && Number.isInteger(timeSeconds.value)
        && timeHours.value === 0
        && timeMinutes.value === 0
        && timeSeconds.value === 0
      ) {
        issues.push({ field: 'timeSeconds', messageKey: 'distancePaceTime.validation.time.positive' })
      }
    }

    if (mode.value === 'time' || mode.value === 'distance') {
      timeField(issues, 'paceMinutes', paceMinutes.value, 0, Number.POSITIVE_INFINITY)
      timeField(issues, 'paceSeconds', paceSeconds.value, 0, 59)

      if (
        Number.isInteger(paceMinutes.value)
        && Number.isInteger(paceSeconds.value)
        && paceMinutes.value === 0
        && paceSeconds.value === 0
      ) {
        issues.push({ field: 'paceSeconds', messageKey: 'distancePaceTime.validation.pace.positive' })
      }
    }

    return issues
  })

  function getIssue(
    field: DistancePaceTimeValidationIssue['field'],
  ): DistancePaceTimeValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null

    if (mode.value === 'time') {
      return calculateTimeByDistanceAndPace(distanceKm.value, {
        minutes: paceMinutes.value,
        seconds: paceSeconds.value,
      })
    }

    if (mode.value === 'pace') {
      return calculatePaceByDistanceAndTime(distanceKm.value, {
        hours: timeHours.value,
        minutes: timeMinutes.value,
        seconds: timeSeconds.value,
      })
    }

    return calculateDistanceByTimeAndPace(
      {
        hours: timeHours.value,
        minutes: timeMinutes.value,
        seconds: timeSeconds.value,
      },
      {
        minutes: paceMinutes.value,
        seconds: paceSeconds.value,
      },
    )
  })

  return {
    mode,
    distanceKm,
    timeHours,
    timeMinutes,
    timeSeconds,
    paceMinutes,
    paceSeconds,
    distancePresets: DISTANCE_PRESETS,
    allIssues,
    result,
    touch,
    getIssue,
    setDistance,
  }
}

function positiveNumberField(
  issues: DistancePaceTimeValidationIssue[],
  field: DistancePaceTimeValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `distancePaceTime.validation.${field}.required` })
  } else if (value <= 0) {
    issues.push({ field, messageKey: `distancePaceTime.validation.${field}.positive` })
  }
}

function timeField(
  issues: DistancePaceTimeValidationIssue[],
  field: DistancePaceTimeValidationIssue['field'],
  value: number,
  min: number,
  max: number,
) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    issues.push({ field, messageKey: `distancePaceTime.validation.${field}.integer` })
  } else if (value < min || value > max) {
    issues.push({ field, messageKey: `distancePaceTime.validation.${field}.range` })
  }
}
