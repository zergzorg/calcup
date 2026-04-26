import { computed, onMounted, ref } from 'vue'
import { calculatePregnancyDueDate, parseDateOnly } from '../lib/calculations'
import type {
  PregnancyDueDateInputField,
  PregnancyDueDateMode,
  PregnancyDueDateValidationIssue,
} from '../types/pregnancyDueDate'

function validateDate(field: PregnancyDueDateInputField, value: string): PregnancyDueDateValidationIssue | null {
  return parseDateOnly(value) ? null : { field, messageKey: `pregnancyDueDate.validation.${field}.invalid` }
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function usePregnancyDueDateCalculator() {
  const mode = ref<PregnancyDueDateMode>('lmp')
  const lmpDate = ref('')
  const conceptionDate = ref('')
  const todayDate = ref('')
  const touched = ref(new Set<PregnancyDueDateInputField>())

  onMounted(() => {
    const today = new Date()
    const lmp = new Date(today)
    lmp.setDate(lmp.getDate() - 115)
    const conception = new Date(lmp)
    conception.setDate(conception.getDate() + 14)

    todayDate.value = toDateString(today)
    lmpDate.value = toDateString(lmp)
    conceptionDate.value = toDateString(conception)
  })

  function touch(field: PregnancyDueDateInputField) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<PregnancyDueDateValidationIssue[]>(() => {
    const fields: Array<[PregnancyDueDateInputField, string]> = [
      ['todayDate', todayDate.value],
      [mode.value === 'lmp' ? 'lmpDate' : 'conceptionDate', mode.value === 'lmp' ? lmpDate.value : conceptionDate.value],
    ]

    return fields
      .map(([field, value]) => validateDate(field, value))
      .filter((issue): issue is PregnancyDueDateValidationIssue => Boolean(issue))
  })

  const result = computed(() => {
    if (allIssues.value.length > 0) return null

    return calculatePregnancyDueDate({
      mode: mode.value,
      lmpDate: lmpDate.value,
      conceptionDate: conceptionDate.value,
      todayDate: todayDate.value,
    })
  })

  function getIssue(field: PregnancyDueDateInputField): PregnancyDueDateValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  return {
    mode,
    lmpDate,
    conceptionDate,
    todayDate,
    issues: allIssues,
    result,
    touch,
    getIssue,
  }
}
