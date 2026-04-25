import { computed, onMounted, ref } from 'vue'
import { calculateDayDifference, isValidDateOnly } from '../lib/calculations'
import type { DateDiffValidationIssue } from '../types/date-diff'

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useDateDiffCalculator() {
  // Empty during SSG to avoid hydration mismatch; filled after mount
  const startDate = ref('')
  const endDate = ref('')
  const includeEndDate = ref(false)

  onMounted(() => {
    const today = new Date()
    const end = new Date(today)
    end.setDate(end.getDate() + 30)
    startDate.value = toDateString(today)
    endDate.value = toDateString(end)
  })

  const touched = ref(new Set<DateDiffValidationIssue['field']>())

  function touch(field: DateDiffValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<DateDiffValidationIssue[]>(() => {
    const result: DateDiffValidationIssue[] = []
    if (!startDate.value || !isValidDateOnly(startDate.value)) {
      result.push({ field: 'startDate', messageKey: 'dateDiff.validation.startDate.invalid' })
    }
    if (!endDate.value || !isValidDateOnly(endDate.value)) {
      result.push({ field: 'endDate', messageKey: 'dateDiff.validation.endDate.invalid' })
    }
    return result
  })

  function getIssue(field: DateDiffValidationIssue['field']): DateDiffValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(i => i.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateDayDifference(startDate.value, endDate.value, { includeEndDate: includeEndDate.value })
  })

  return {
    startDate,
    endDate,
    includeEndDate,
    touch,
    getIssue,
    result,
  }
}
