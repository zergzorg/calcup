import { computed, ref } from 'vue'
import {
  calculatePaint,
  isValidNonNegativeInteger,
  isValidNonNegativeNumber,
  isValidPositiveInteger,
  isValidPositiveNumber,
} from '../lib/calculations'
import type { PaintInput, PaintValidationIssue } from '../types/paint'

export const PAINT_CAN_PRESETS = [0.9, 2.5, 5, 10] as const
export const PAINT_COVERAGE_PRESETS = [7, 10, 12] as const

export function usePaintCalculator() {
  const input = ref<PaintInput>({
    roomLength: 5,
    roomWidth: 4,
    wallHeight: 2.7,
    windowsCount: 1,
    windowWidth: 1.5,
    windowHeight: 1.4,
    doorsCount: 1,
    doorWidth: 0.9,
    doorHeight: 2,
    extraOpeningsArea: 0,
    coats: 2,
    coveragePerLiter: 10,
    wastePercent: 10,
    canVolume: 2.5,
    canPrice: 0,
  })

  const touched = ref(new Set<PaintValidationIssue['field']>())

  function touch(field: PaintValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  function setCoverage(value: number) {
    input.value.coveragePerLiter = value
  }

  function setCanVolume(value: number) {
    input.value.canVolume = value
  }

  const allIssues = computed<PaintValidationIssue[]>(() => {
    const issues: PaintValidationIssue[] = []
    const value = input.value

    positiveField(issues, 'roomLength', value.roomLength)
    positiveField(issues, 'roomWidth', value.roomWidth)
    positiveField(issues, 'wallHeight', value.wallHeight)
    nonNegativeIntegerField(issues, 'windowsCount', value.windowsCount)
    nonNegativeIntegerField(issues, 'doorsCount', value.doorsCount)
    nonNegativeField(issues, 'windowWidth', value.windowWidth)
    nonNegativeField(issues, 'windowHeight', value.windowHeight)
    nonNegativeField(issues, 'doorWidth', value.doorWidth)
    nonNegativeField(issues, 'doorHeight', value.doorHeight)
    nonNegativeField(issues, 'extraOpeningsArea', value.extraOpeningsArea)
    positiveIntegerField(issues, 'coats', value.coats)
    positiveField(issues, 'coveragePerLiter', value.coveragePerLiter)
    percentField(issues, 'wastePercent', value.wastePercent)
    positiveField(issues, 'canVolume', value.canVolume)
    nonNegativeField(issues, 'canPrice', value.canPrice)

    return issues
  })

  function getIssue(field: PaintValidationIssue['field']): PaintValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculatePaint(input.value)
  })

  return {
    input,
    allIssues,
    result,
    canPresets: PAINT_CAN_PRESETS,
    coveragePresets: PAINT_COVERAGE_PRESETS,
    touch,
    getIssue,
    setCoverage,
    setCanVolume,
  }
}

function positiveField(
  issues: PaintValidationIssue[],
  field: PaintValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.required` })
  } else if (!isValidPositiveNumber(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.positive` })
  }
}

function positiveIntegerField(
  issues: PaintValidationIssue[],
  field: PaintValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.integer` })
  } else if (!isValidPositiveInteger(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.positive` })
  }
}

function nonNegativeField(
  issues: PaintValidationIssue[],
  field: PaintValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.required` })
  } else if (!isValidNonNegativeNumber(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.nonNegative` })
  }
}

function nonNegativeIntegerField(
  issues: PaintValidationIssue[],
  field: PaintValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.integer` })
  } else if (!isValidNonNegativeInteger(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.nonNegative` })
  }
}

function percentField(
  issues: PaintValidationIssue[],
  field: PaintValidationIssue['field'],
  value: number,
) {
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.required` })
  } else if (!isValidNonNegativeNumber(value)) {
    issues.push({ field, messageKey: `paint.validation.${field}.nonNegative` })
  } else if (value > 100) {
    issues.push({ field, messageKey: `paint.validation.${field}.max` })
  }
}
