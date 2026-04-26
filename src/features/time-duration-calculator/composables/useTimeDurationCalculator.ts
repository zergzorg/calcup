import { computed, reactive, ref } from 'vue'
import { calculateTimeDuration } from '../lib/calculations'
import type {
  DurationParts,
  TimeDurationInput,
  TimeDurationInputField,
  TimeDurationOperation,
  TimeDurationValidationIssue,
} from '../types/time-duration'

export function useTimeDurationCalculator() {
  const input = reactive<TimeDurationInput>({
    firstHours: 1,
    firstMinutes: 30,
    firstSeconds: 0,
    secondHours: 0,
    secondMinutes: 45,
    secondSeconds: 30,
    operation: 'add',
  })

  const touched = ref(new Set<TimeDurationInputField>())

  function touch(field: TimeDurationInputField) {
    touched.value = new Set(touched.value).add(field)
  }

  function setOperation(operation: TimeDurationOperation) {
    input.operation = operation
  }

  const allIssues = computed<TimeDurationValidationIssue[]>(() => {
    const fields: TimeDurationInputField[] = [
      'firstHours',
      'firstMinutes',
      'firstSeconds',
      'secondHours',
      'secondMinutes',
      'secondSeconds',
    ]

    return fields.flatMap((field) => {
      const value = input[field]
      if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
        return [{ field, messageKey: 'timeDuration.validation.nonNegativeInteger' }]
      }
      return []
    })
  })

  function getIssue(field: TimeDurationInputField): TimeDurationValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null

    const first: DurationParts = {
      hours: input.firstHours,
      minutes: input.firstMinutes,
      seconds: input.firstSeconds,
    }
    const second: DurationParts = {
      hours: input.secondHours,
      minutes: input.secondMinutes,
      seconds: input.secondSeconds,
    }

    return calculateTimeDuration(first, second, input.operation)
  })

  return {
    input,
    result,
    touch,
    getIssue,
    setOperation,
  }
}
