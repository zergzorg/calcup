import { computed, ref } from 'vue'
import { TAX_2026_CONFIG } from '../../../config'
import {
  calculateSalary,
  isValidNonNegativeNumber,
  isValidPositiveNumber,
} from '../lib/calculations'
import type {
  SalaryValidationIssue,
  ScheduleType,
  AdditionalIncomeInput,
} from '../types/salary'

export function useSalaryCalculator() {
  const monthlySalary = ref(120_000)
  const salaryTaxMode = ref<'russiaProgressive' | 'custom'>('russiaProgressive')
  const customSalaryTaxPercent = ref(TAX_2026_CONFIG.personalIncomeTax.defaultRatePercent)
  const additionalIncomes = ref<AdditionalIncomeInput[]>([
    { amount: 0, taxPercent: TAX_2026_CONFIG.personalIncomeTax.defaultRatePercent },
  ])
  const scheduleType = ref<ScheduleType>('fiveTwo')
  const hoursPerWorkDay = ref(8)
  const customWorkDaysPerYear = ref(247)

  const touched = ref(new Set<SalaryValidationIssue['field']>())

  function touch(field: SalaryValidationIssue['field']) {
    touched.value = new Set(touched.value).add(field)
  }

  const allIssues = computed<SalaryValidationIssue[]>(() => {
    const issues: SalaryValidationIssue[] = []

    if (!Number.isFinite(monthlySalary.value)) {
      issues.push({ field: 'monthlySalary', messageKey: 'salary.validation.monthlySalary.required' })
    } else if (!isValidPositiveNumber(monthlySalary.value)) {
      issues.push({ field: 'monthlySalary', messageKey: 'salary.validation.monthlySalary.positive' })
    }

    if (salaryTaxMode.value === 'custom') {
      if (!Number.isFinite(customSalaryTaxPercent.value)) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'salary.validation.customSalaryTaxPercent.required',
        })
      } else if (!isValidNonNegativeNumber(customSalaryTaxPercent.value)) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'salary.validation.customSalaryTaxPercent.nonNegative',
        })
      } else if (customSalaryTaxPercent.value > 100) {
        issues.push({
          field: 'customSalaryTaxPercent',
          messageKey: 'salary.validation.customSalaryTaxPercent.max',
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
        issues.push({ field: amountField, messageKey: 'salary.validation.additionalIncome.required' })
      } else if (!isValidNonNegativeNumber(item.amount)) {
        issues.push({ field: amountField, messageKey: 'salary.validation.additionalIncome.nonNegative' })
      }

      if (isBlankOptionalNumber(item.taxPercent)) {
        return
      }
      if (!Number.isFinite(item.taxPercent)) {
        issues.push({
          field: taxField,
          messageKey: 'salary.validation.additionalIncomeTaxPercent.required',
        })
      } else if (!isValidNonNegativeNumber(item.taxPercent)) {
        issues.push({
          field: taxField,
          messageKey: 'salary.validation.additionalIncomeTaxPercent.nonNegative',
        })
      } else if (item.taxPercent > 100) {
        issues.push({
          field: taxField,
          messageKey: 'salary.validation.additionalIncomeTaxPercent.max',
        })
      }
    })

    if (!Number.isFinite(hoursPerWorkDay.value)) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'salary.validation.hoursPerWorkDay.required' })
    } else if (!isValidPositiveNumber(hoursPerWorkDay.value)) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'salary.validation.hoursPerWorkDay.positive' })
    } else if (hoursPerWorkDay.value > 24) {
      issues.push({ field: 'hoursPerWorkDay', messageKey: 'salary.validation.hoursPerWorkDay.max' })
    }

    if (scheduleType.value === 'custom') {
      if (!Number.isFinite(customWorkDaysPerYear.value)) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'salary.validation.customWorkDaysPerYear.required',
        })
      } else if (!isValidPositiveNumber(customWorkDaysPerYear.value)) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'salary.validation.customWorkDaysPerYear.positive',
        })
      } else if (customWorkDaysPerYear.value > 366) {
        issues.push({
          field: 'customWorkDaysPerYear',
          messageKey: 'salary.validation.customWorkDaysPerYear.max',
        })
      }
    }

    return issues
  })

  function getIssue(field: SalaryValidationIssue['field']): SalaryValidationIssue | undefined {
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
    return calculateSalary({
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
