import { computed, onMounted, reactive, ref } from 'vue'
import { calculateWorkdays, parseDateOnly } from '../lib/calculations'
import type { WorkdaysInput, WorkdaysInputField, WorkdaysValidationIssue } from '../types/workdays'

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function useWorkdaysCalculator() {
  const input = reactive<WorkdaysInput>({
    startDate: '',
    endDate: '',
    includeEndDate: true,
  })

  onMounted(() => {
    const today = new Date()
    const end = new Date(today)
    end.setDate(end.getDate() + 14)
    input.startDate = toDateString(today)
    input.endDate = toDateString(end)
  })

  const touched = ref(new Set<WorkdaysInputField>())

  function touch(field: WorkdaysInputField) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<WorkdaysValidationIssue[]>(() => {
    const issues: WorkdaysValidationIssue[] = []
    if (!parseDateOnly(input.startDate)) {
      issues.push({ field: 'startDate', messageKey: 'workdays.validation.startDate.invalid' })
    }
    if (!parseDateOnly(input.endDate)) {
      issues.push({ field: 'endDate', messageKey: 'workdays.validation.endDate.invalid' })
    }
    return issues
  })

  function getIssue(field: WorkdaysInputField): WorkdaysValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateWorkdays(input.startDate, input.endDate, { includeEndDate: input.includeEndDate })
  })

  return {
    input,
    result,
    touch,
    getIssue,
  }
}
