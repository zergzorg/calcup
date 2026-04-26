import { computed, reactive } from 'vue'
import { calculateElectricity } from '../lib/calculations'
import type { ElectricityInput, ElectricityValidationIssue } from '../types/electricity'

export function useElectricityCalculator() {
  const form = reactive<ElectricityInput>({
    powerW: 1000,
    devicesCount: 1,
    hoursPerDay: 2,
    daysPerMonth: 30,
    tariffPerKwh: 6,
  })

  const issues = computed<ElectricityValidationIssue[]>(() => validateElectricityInput(form))
  const result = computed(() => (issues.value.length > 0 ? null : calculateElectricity(form)))

  function setPower(powerW: number) {
    form.powerW = powerW
  }

  function setHours(hoursPerDay: number) {
    form.hoursPerDay = hoursPerDay
  }

  function getFieldIssue(field: keyof ElectricityInput) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  return {
    form,
    issues,
    result,
    setPower,
    setHours,
    getFieldIssue,
  }
}

function validateElectricityInput(input: ElectricityInput): ElectricityValidationIssue[] {
  const issues: ElectricityValidationIssue[] = []

  addNonNegativeIssue(issues, input, 'powerW', 'electricity.validation.power')
  addIntegerIssue(issues, input, 'devicesCount', 'electricity.validation.devicesCount')
  addRangeIssue(issues, input, 'hoursPerDay', 'electricity.validation.hoursPerDay', 0, 24)
  addRangeIssue(issues, input, 'daysPerMonth', 'electricity.validation.daysPerMonth', 1, 31, true)
  addNonNegativeIssue(issues, input, 'tariffPerKwh', 'electricity.validation.tariff')

  return issues
}

function addNonNegativeIssue(
  issues: ElectricityValidationIssue[],
  input: ElectricityInput,
  field: keyof ElectricityInput,
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
  issues: ElectricityValidationIssue[],
  input: ElectricityInput,
  field: keyof ElectricityInput,
  baseKey: string,
) {
  const value = input[field]
  if (!Number.isInteger(value)) {
    issues.push({ field, messageKey: `${baseKey}.integer` })
    return
  }

  if (value <= 0) {
    issues.push({ field, messageKey: `${baseKey}.positive` })
  }
}

function addRangeIssue(
  issues: ElectricityValidationIssue[],
  input: ElectricityInput,
  field: keyof ElectricityInput,
  baseKey: string,
  min: number,
  max: number,
  integer = false,
) {
  const value = input[field]
  if (!Number.isFinite(value)) {
    issues.push({ field, messageKey: `${baseKey}.required` })
    return
  }

  if (integer && !Number.isInteger(value)) {
    issues.push({ field, messageKey: `${baseKey}.integer` })
    return
  }

  if (value < min || value > max) {
    issues.push({ field, messageKey: `${baseKey}.range` })
  }
}
