import { computed, ref } from 'vue'
import {
  adjustByPercent,
  calculatePartOfTotal,
  calculatePercentageChange,
  calculatePercentOf,
} from '../lib/calculations'
import type {
  AdjustmentDirection,
  PercentageInputField,
  PercentageMode,
  PercentageResult,
  PercentageValidationIssue,
} from '../types/percentage'

const MAX_ABS_VALUE = 1_000_000_000_000

function validateFinite(field: PercentageInputField, value: number): PercentageValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `percentage.validation.${field}.required` }
  }

  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { field, messageKey: `percentage.validation.${field}.range` }
  }

  return null
}

export function usePercentageCalculator() {
  const mode = ref<PercentageMode>('percentOf')
  const adjustmentDirection = ref<AdjustmentDirection>('increase')

  const percent = ref(15)
  const base = ref(200)
  const part = ref(25)
  const total = ref(200)
  const oldValue = ref(80)
  const newValue = ref(100)

  const issues = computed(() => {
    const nextIssues: PercentageValidationIssue[] = []

    if (mode.value === 'percentOf') {
      const percentIssue = validateFinite('percent', percent.value)
      const baseIssue = validateFinite('base', base.value)
      if (percentIssue) nextIssues.push(percentIssue)
      if (baseIssue) nextIssues.push(baseIssue)
    }

    if (mode.value === 'partOfTotal') {
      const partIssue = validateFinite('part', part.value)
      const totalIssue = validateFinite('total', total.value)
      if (partIssue) nextIssues.push(partIssue)
      if (totalIssue) nextIssues.push(totalIssue)
      if (!totalIssue && total.value === 0) {
        nextIssues.push({ field: 'total', messageKey: 'percentage.validation.total.nonZero' })
      }
    }

    if (mode.value === 'adjustByPercent') {
      const baseIssue = validateFinite('base', base.value)
      const percentIssue = validateFinite('percent', percent.value)
      if (baseIssue) nextIssues.push(baseIssue)
      if (percentIssue) nextIssues.push(percentIssue)
    }

    if (mode.value === 'percentageChange') {
      const oldIssue = validateFinite('oldValue', oldValue.value)
      const newIssue = validateFinite('newValue', newValue.value)
      if (oldIssue) nextIssues.push(oldIssue)
      if (newIssue) nextIssues.push(newIssue)
      if (!oldIssue && oldValue.value === 0) {
        nextIssues.push({ field: 'oldValue', messageKey: 'percentage.validation.oldValue.nonZero' })
      }
    }

    return nextIssues
  })

  const result = computed<PercentageResult | null>(() => {
    if (issues.value.length > 0) return null

    if (mode.value === 'percentOf') {
      const value = calculatePercentOf(percent.value, base.value)
      return value === null ? null : { value, unit: 'number' }
    }

    if (mode.value === 'partOfTotal') {
      const value = calculatePartOfTotal(part.value, total.value)
      return value === null ? null : { value, unit: 'percent' }
    }

    if (mode.value === 'adjustByPercent') {
      const value = adjustByPercent(base.value, percent.value, adjustmentDirection.value)
      return value === null ? null : { value, unit: 'number' }
    }

    const value = calculatePercentageChange(oldValue.value, newValue.value)
    return value === null ? null : { value, unit: 'percent' }
  })

  function getIssue(field: PercentageInputField): PercentageValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    mode,
    adjustmentDirection,
    percent,
    base,
    part,
    total,
    oldValue,
    newValue,
    issues,
    result,
    getIssue,
  }
}
