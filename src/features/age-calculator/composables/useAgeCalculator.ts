import { computed, onMounted, reactive, ref } from 'vue'
import { calculateAge, isValidAgeMilestone, parseDateOnly } from '../lib/calculations'
import type { AgeInput, AgeInputField, AgeValidationIssue } from '../types/age'

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function useAgeCalculator() {
  const input = reactive<AgeInput>({
    birthDate: '',
    targetDate: '',
    milestoneValue: 10_000,
    milestoneUnit: 'days',
  })

  onMounted(() => {
    input.birthDate = '1990-01-01'
    input.targetDate = toDateString(new Date())
  })

  const touched = ref(new Set<AgeInputField>())

  function touch(field: AgeInputField) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<AgeValidationIssue[]>(() => {
    const issues: AgeValidationIssue[] = []
    const birth = parseDateOnly(input.birthDate)
    const target = parseDateOnly(input.targetDate)

    if (!birth) {
      issues.push({ field: 'birthDate', messageKey: 'age.validation.birthDate.invalid' })
    }
    if (!target) {
      issues.push({ field: 'targetDate', messageKey: 'age.validation.targetDate.invalid' })
    }
    if (birth && target && calculateAge(input.birthDate, input.targetDate) === null) {
      issues.push({ field: 'targetDate', messageKey: 'age.validation.targetDate.beforeBirth' })
    }
    if (!isValidAgeMilestone({ value: input.milestoneValue, unit: input.milestoneUnit })) {
      issues.push({ field: 'milestoneValue', messageKey: 'age.validation.milestoneValue.invalid' })
    }

    return issues
  })

  function getIssue(field: AgeInputField): AgeValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    const blockingIssues = allIssues.value.filter(issue => issue.field === 'birthDate' || issue.field === 'targetDate')
    if (blockingIssues.length > 0) return null

    const milestone = isValidAgeMilestone({ value: input.milestoneValue, unit: input.milestoneUnit })
      ? { value: input.milestoneValue, unit: input.milestoneUnit }
      : null

    return calculateAge(input.birthDate, input.targetDate, milestone)
  })

  return {
    input,
    result,
    touch,
    getIssue,
  }
}
