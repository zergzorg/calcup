import { computed, ref } from 'vue'
import { convertPaceToSpeed, convertSpeedToPace } from '../lib/calculations'
import type { PaceSpeedMode, PaceSpeedValidationIssue } from '../types/pace-speed'

export function usePaceSpeedCalculator() {
  const mode = ref<PaceSpeedMode>('paceToSpeed')
  const paceMinutes = ref(5)
  const paceSeconds = ref(30)
  const speedKmH = ref(10.91)
  const touched = ref(new Set<PaceSpeedValidationIssue['field']>())

  function touch(field: PaceSpeedValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<PaceSpeedValidationIssue[]>(() => {
    const issues: PaceSpeedValidationIssue[] = []

    if (mode.value === 'paceToSpeed') {
      const minutes = paceMinutes.value
      const seconds = paceSeconds.value

      if (!Number.isFinite(minutes)) {
        issues.push({ field: 'paceMinutes', messageKey: 'paceSpeed.validation.minutes.required' })
      } else if (!Number.isInteger(minutes) || minutes < 0) {
        issues.push({ field: 'paceMinutes', messageKey: 'paceSpeed.validation.minutes.nonNegativeInteger' })
      }

      if (!Number.isFinite(seconds)) {
        issues.push({ field: 'paceSeconds', messageKey: 'paceSpeed.validation.seconds.required' })
      } else if (!Number.isInteger(seconds) || seconds < 0 || seconds >= 60) {
        issues.push({ field: 'paceSeconds', messageKey: 'paceSpeed.validation.seconds.range' })
      }

      if (Number.isFinite(minutes) && Number.isFinite(seconds) && minutes === 0 && seconds === 0) {
        issues.push({ field: 'paceSeconds', messageKey: 'paceSpeed.validation.pace.positive' })
      }
    }

    if (mode.value === 'speedToPace') {
      const speed = speedKmH.value
      if (!Number.isFinite(speed)) {
        issues.push({ field: 'speed', messageKey: 'paceSpeed.validation.speed.required' })
      } else if (speed <= 0) {
        issues.push({ field: 'speed', messageKey: 'paceSpeed.validation.speed.positive' })
      }
    }

    return issues
  })

  function getIssue(field: PaceSpeedValidationIssue['field']): PaceSpeedValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(i => i.field === field)
  }

  const paceToSpeedResult = computed(() => {
    if (mode.value !== 'paceToSpeed' || allIssues.value.length > 0) return null
    return convertPaceToSpeed({ minutes: paceMinutes.value, seconds: paceSeconds.value })
  })

  const speedToPaceResult = computed(() => {
    if (mode.value !== 'speedToPace' || allIssues.value.length > 0) return null
    return convertSpeedToPace(speedKmH.value)
  })

  const result = computed(() => paceToSpeedResult.value ?? speedToPaceResult.value)

  return {
    mode,
    paceMinutes,
    paceSeconds,
    speedKmH,
    allIssues,
    getIssue,
    touch,
    paceToSpeedResult,
    speedToPaceResult,
    result,
  }
}
