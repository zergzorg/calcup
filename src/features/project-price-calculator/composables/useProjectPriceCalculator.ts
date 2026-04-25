import { computed, ref } from 'vue'
import {
  calculateProjectPrice,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from '../lib/calculations'
import type {
  ComplexityLevel,
  ProjectPriceValidationIssue,
  UrgencyLevel,
} from '../types/project-price'

export function useProjectPriceCalculator() {
  const hourlyRate = ref(1000)
  const projectHours = ref(10)
  const complexityLevel = ref<ComplexityLevel>('normal')
  const urgencyLevel = ref<UrgencyLevel>('normal')
  const expenseAmount = ref(0)
  const taxPercent = ref(0)

  const touched = ref(new Set<ProjectPriceValidationIssue['field']>())

  function touch(field: ProjectPriceValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<ProjectPriceValidationIssue[]>(() => {
    const issues: ProjectPriceValidationIssue[] = []

    if (!Number.isFinite(hourlyRate.value)) {
      issues.push({ field: 'hourlyRate', messageKey: 'projectPrice.validation.hourlyRate.required' })
    } else if (!isValidPositiveNumber(hourlyRate.value)) {
      issues.push({ field: 'hourlyRate', messageKey: 'projectPrice.validation.hourlyRate.positive' })
    }

    if (!Number.isFinite(projectHours.value)) {
      issues.push({ field: 'projectHours', messageKey: 'projectPrice.validation.projectHours.required' })
    } else if (!isValidNonNegativeNumber(projectHours.value)) {
      issues.push({ field: 'projectHours', messageKey: 'projectPrice.validation.projectHours.nonNegative' })
    }

    if (!Number.isFinite(expenseAmount.value)) {
      issues.push({ field: 'expenseAmount', messageKey: 'projectPrice.validation.expenseAmount.required' })
    } else if (!isValidNonNegativeNumber(expenseAmount.value)) {
      issues.push({ field: 'expenseAmount', messageKey: 'projectPrice.validation.expenseAmount.nonNegative' })
    }

    if (!Number.isFinite(taxPercent.value)) {
      issues.push({ field: 'taxPercent', messageKey: 'projectPrice.validation.taxPercent.required' })
    } else if (!isValidNonNegativeNumber(taxPercent.value)) {
      issues.push({ field: 'taxPercent', messageKey: 'projectPrice.validation.taxPercent.nonNegative' })
    } else if (taxPercent.value > 100) {
      issues.push({ field: 'taxPercent', messageKey: 'projectPrice.validation.taxPercent.max' })
    }

    return issues
  })

  function getIssue(field: ProjectPriceValidationIssue['field']): ProjectPriceValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateProjectPrice({
      hourlyRate: hourlyRate.value,
      projectHours: projectHours.value,
      complexityLevel: complexityLevel.value,
      urgencyLevel: urgencyLevel.value,
      expenseAmount: expenseAmount.value,
      taxPercent: taxPercent.value,
    })
  })

  return {
    hourlyRate,
    projectHours,
    complexityLevel,
    urgencyLevel,
    expenseAmount,
    taxPercent,
    allIssues,
    touch,
    getIssue,
    result,
  }
}
