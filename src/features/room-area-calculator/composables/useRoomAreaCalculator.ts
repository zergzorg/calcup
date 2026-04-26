import { computed, reactive } from 'vue'
import { calculateRoomArea } from '../lib/calculations'
import type { RoomAreaInput, RoomAreaValidationIssue } from '../types/room-area'

export function useRoomAreaCalculator() {
  const form = reactive<RoomAreaInput>({
    lengthM: 5,
    widthM: 4,
    heightM: 2.7,
    windowsCount: 1,
    windowWidthM: 1.2,
    windowHeightM: 1.4,
    doorsCount: 1,
    doorWidthM: 0.9,
    doorHeightM: 2,
    extraOpeningsAreaM2: 0,
  })

  const issues = computed<RoomAreaValidationIssue[]>(() => validateRoomAreaInput(form))
  const result = computed(() => (issues.value.length > 0 ? null : calculateRoomArea(form)))

  function setHeight(heightM: number) {
    form.heightM = heightM
  }

  function getFieldIssue(field: keyof RoomAreaInput) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    form,
    issues,
    result,
    setHeight,
    getFieldIssue,
  }
}

function validateRoomAreaInput(input: RoomAreaInput): RoomAreaValidationIssue[] {
  const issues: RoomAreaValidationIssue[] = []

  addPositiveIssue(issues, input, 'lengthM', 'roomArea.validation.length')
  addPositiveIssue(issues, input, 'widthM', 'roomArea.validation.width')
  addPositiveIssue(issues, input, 'heightM', 'roomArea.validation.height')
  addIntegerIssue(issues, input, 'windowsCount', 'roomArea.validation.windowsCount')
  addNonNegativeIssue(issues, input, 'windowWidthM', 'roomArea.validation.windowWidth')
  addNonNegativeIssue(issues, input, 'windowHeightM', 'roomArea.validation.windowHeight')
  addIntegerIssue(issues, input, 'doorsCount', 'roomArea.validation.doorsCount')
  addNonNegativeIssue(issues, input, 'doorWidthM', 'roomArea.validation.doorWidth')
  addNonNegativeIssue(issues, input, 'doorHeightM', 'roomArea.validation.doorHeight')
  addNonNegativeIssue(issues, input, 'extraOpeningsAreaM2', 'roomArea.validation.extraOpeningsArea')

  return issues
}

function addPositiveIssue(
  issues: RoomAreaValidationIssue[],
  input: RoomAreaInput,
  field: keyof RoomAreaInput,
  baseKey: string,
) {
  const value = input[field]
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `${baseKey}.required` })
    return
  }

  if (value <= 0) {
    issues.push({ field, messageKey: `${baseKey}.positive` })
  }
}

function addNonNegativeIssue(
  issues: RoomAreaValidationIssue[],
  input: RoomAreaInput,
  field: keyof RoomAreaInput,
  baseKey: string,
) {
  const value = input[field]
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `${baseKey}.required` })
    return
  }

  if (value < 0) {
    issues.push({ field, messageKey: `${baseKey}.nonNegative` })
  }
}

function addIntegerIssue(
  issues: RoomAreaValidationIssue[],
  input: RoomAreaInput,
  field: keyof RoomAreaInput,
  baseKey: string,
) {
  const value = input[field]
  if (!Number.isInteger(value)) {
    issues.push({ field, messageKey: `${baseKey}.integer` })
    return
  }

  if (value < 0) {
    issues.push({ field, messageKey: `${baseKey}.nonNegative` })
  }
}
