import { computed, ref } from 'vue'
import {
  calculateHourlyRate,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from '../lib/calculations'
import type {
  HourlyRateValidationIssue,
  ScheduleType,
  AdditionalIncomeInput,
} from '../types/hourly-rate'

export function useHourlyRateCalculator() {
  const monthlySalary = ref(120_000)
  const salaryTaxMode = ref<'russiaProgressive' | 'custom'>('russiaProgressive')
  const customSalaryTaxPercent = ref(13)
  const additionalIncomes = ref<AdditionalIncomeInput[]>([
    { amount: 0, taxPercent: 13 },
  ])
  const scheduleType = ref<ScheduleType>('fiveTwo')
  const hoursPerWorkDay = ref(8)
  const customWorkDaysPerYear = ref(247)

  const touched = ref(new Set<HourlyRateValidationIssue['field']>())

  function touch(field: HourlyRateValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<HourlyRateValidationIssue[]>(() => {
    const issues: HourlyRateValidationIssue[] = []

    if (!Number.isFinite(monthlySalary.value)) {
      issues.push({ field: 'monthlySalary', messageKey: 'hourlyRate.validation.monthlySalary.required' })
    } else if (!isValidPositiveNumber(monthlySalary.value)) {
      issues.push({ field: 'monthlySalary', messageKey: 'hourlyRate.validation.monthlySalary.positive' })
    }

    if (salaryTaxMode.value === 'custom') {
      if (!Number.isFinite(customSalaryTaxPercent.value)) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'hourlyRate.validation.customSalaryTaxPercent.required',
        })
      } else if (!isValidNonNegativeNumber(customSalaryTaxPercent.value)) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'hourlyRate.validation.customSalaryTaxPercent.nonNegative',
        })
      } else if (customSalaryTaxPercent.value > 100) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'hourlyRate.validation.customSalaryTaxPercent.max',
        })
      }
    }

    additionalIncomes.value.forEach((item, index) => {
      const amountField = `additionalIncome.${index}.amount` as const
      const taxField = `additionalIncome.${index}.taxPercent` as const

      if (isBlankOptionalNumber(item.amount)) {
        return
      }
      if (!Number.isFinite(item.amount)) {
        issues.push({ field: amountField, messageKey: 'hourlyRate.validation.additionalIncome.required' })
      } else if (!isValidNonNegativeNumber(item.amount)) {
        issues.push({ field: amountField, messageKey: 'hourlyRate.validation.additionalIncome.nonNegative' })
      }

      if (isBlankOptionalNumber(item.taxPercent)) {
        return
      }
      if (!Number.isFinite(item.taxPercent)) {
        issues.push({
          field: taxField,
          messageKey: 'hourlyRate.validation.additionalIncomeTaxPercent.required',
        })
      } else if (!isValidNonNegativeNumber(item.taxPercent)) {
        issues.push({
          field: taxField,
          messageKey: 'hourlyRate.validation.additionalIncomeTaxPercent.nonNegative',
        })
      } else if (item.taxPercent > 100) {
        issues.push({
          field: taxField,
          messageKey: 'hourlyRate.validation.additionalIncomeTaxPercent.max',
        })
      }
    })

    if (!Number.isFinite(hoursPerWorkDay.value)) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'hourlyRate.validation.hoursPerWorkDay.required' })
    } else if (!isValidPositiveNumber(hoursPerWorkDay.value)) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'hourlyRate.validation.hoursPerWorkDay.positive' })
    } else if (hoursPerWorkDay.value > 24) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'hourlyRate.validation.hoursPerWorkDay.max' })
    }

    if (scheduleType.value === 'custom') {
      if (!Number.isFinite(customWorkDaysPerYear.value)) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'hourlyRate.validation.customWorkDaysPerYear.required',
        })
      } else if (!isValidPositiveNumber(customWorkDaysPerYear.value)) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'hourlyRate.validation.customWorkDaysPerYear.positive',
        })
      } else if (customWorkDaysPerYear.value > 366) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'hourlyRate.validation.customWorkDaysPerYear.max',
        })
      }
    }

    return issues
  })

  function getIssue(field: HourlyRateValidationIssue['field']): HourlyRateValidationIssue | undefined {
    if (!touched.value.has(field)) return undefined
    return allIssues.value.find(issue => issue.field === field)
  }

  function addAdditionalIncome() {
    additionalIncomes.value = [
      ...additionalIncomes.value,
      { amount: 0, taxPercent: 13 },
    ]
  }

  function removeAdditionalIncome(index: number) {
    if (additionalIncomes.value.length <= 1) return
    additionalIncomes.value = additionalIncomes.value.filter((_, i) => i !== index)
  }

  const result = computed(() => {
    if (allIssues.value.length > 0) return null
    return calculateHourlyRate({
      monthlySalary: monthlySalary.value,
      salaryTaxMode: salaryTaxMode.value,
      customSalaryTaxPercent: customSalaryTaxPercent.value,
      additionalIncomes: additionalIncomes.value.map(item => ({
        amount: normalizeOptionalNumber(item.amount),
        taxPercent: normalizeOptionalNumber(item.taxPercent),
      })),
      scheduleType: scheduleType.value,
      hoursPerWorkDay: hoursPerWorkDay.value,
      customWorkDaysPerYear: customWorkDaysPerYear.value,
    })
  })

  return {
    monthlySalary,
    salaryTaxMode,
    customSalaryTaxPercent,
    additionalIncomes,
    addAdditionalIncome,
    removeAdditionalIncome,
    scheduleType,
    hoursPerWorkDay,
    customWorkDaysPerYear,
    allIssues,
    touch,
    getIssue,
    result,
  }
}

function normalizeOptionalNumber(value: number | string | null | undefined): number {
  if (value === '' || value === null || value === undefined) return 0
  return Number(value)
}

function isBlankOptionalNumber(value: unknown): boolean {
  return value === '' || value === null || value === undefined
}
