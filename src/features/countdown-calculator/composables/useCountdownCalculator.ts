import { computed, onMounted, reactive, ref } from 'vue'
import { calculateCountdown, parseDateOnly } from '../lib/calculations'
import type { CountdownInput, CountdownInputField, CountdownValidationIssue } from '../types/countdown'

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function useCountdownCalculator() {
  const input = reactive<CountdownInput>({
    startDate: '',
    targetDate: '',
    includeStartDate: false,
  })

  onMounted(() => {
    const today = new Date()
    const target = new Date(today)
    target.setDate(target.getDate() + 30)
    input.startDate = toDateString(today)
    input.targetDate = toDateString(target)
  })

  const touched = ref(new Set<CountdownInputField>())

  function touch(field: CountdownInputField) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<CountdownValidationIssue[]>(() => {
    const issues: CountdownValidationIssue[] = []
    if (!parseDateOnly(input.startDate)) {
      issues.push({ field: 'startDate', messageKey: 'countdown.validation.startDate.invalid' })
    }
    if (!parseDateOnly(input.targetDate)) {
      issues.push({ field: 'targetDate', messageKey: 'countdown.validation.targetDate.invalid' })
    }
    return issues
  })

  function getIssue(field: CountdownInputField): CountdownValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateCountdown(input.startDate, input.targetDate, { includeStartDate: input.includeStartDate })
  })

  return {
    input,
    result,
    touch,
    getIssue,
  }
}
