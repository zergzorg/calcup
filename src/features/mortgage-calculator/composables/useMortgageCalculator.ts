import { computed, ref } from 'vue'
import { calculateMortgage } from '../lib/calculations'
import type { MortgageInputField, MortgageValidationIssue } from '../types/mortgage'

const FIELD_RANGES: Record<MortgageInputField, { min: number; max: number }> = {
  propertyPrice: { min: 100_000, max: 1_000_000_000 },
  downPaymentPercent: { min: 0, max: 99 },
  annualRate: { min: 0, max: 100 },
  termYears: { min: 1, max: 40 },
  additionalContribution: { min: 0, max: 1_000_000_000 },
  monthlyCosts: { min: 0, max: 10_000_000 },
  oneTimeFees: { min: 0, max: 100_000_000 },
  earlyPayment: { min: 0, max: 1_000_000_000 },
  extraMonthlyPayment: { min: 0, max: 10_000_000 },
}

function validateNumber(field: MortgageInputField, value: number): MortgageValidationIssue | null {
  if (!Number.isFinite(value)) {
    return { field, messageKey: `mortgage.validation.${field}.required` }
  }

  const range = FIELD_RANGES[field]
  if (value < range.min || value > range.max) {
    return { field, messageKey: `mortgage.validation.${field}.range` }
  }

  return null
}

export function useMortgageCalculator() {
  const propertyPrice = ref(8_000_000)
  const downPaymentPercent = ref(20)
  const annualRate = ref(12)
  const termYears = ref(20)
  const additionalContribution = ref(0)
  const monthlyCosts = ref(0)
  const oneTimeFees = ref(0)
  const earlyPayment = ref(0)
  const extraMonthlyPayment = ref(0)

  const issues = computed<MortgageValidationIssue[]>(() =>
    ([
      ['propertyPrice', propertyPrice.value],
      ['downPaymentPercent', downPaymentPercent.value],
      ['annualRate', annualRate.value],
      ['termYears', termYears.value],
      ['additionalContribution', additionalContribution.value],
      ['monthlyCosts', monthlyCosts.value],
      ['oneTimeFees', oneTimeFees.value],
      ['earlyPayment', earlyPayment.value],
      ['extraMonthlyPayment', extraMonthlyPayment.value],
    ] satisfies Array<[MortgageInputField, number]>)
      .map(([field, value]) => validateNumber(field, value))
      .filter((issue): issue is MortgageValidationIssue => Boolean(issue)),
  )

  const result = computed(() => {
    if (issues.value.length > 0) return null

    return calculateMortgage({
      propertyPrice: propertyPrice.value,
      downPaymentPercent: downPaymentPercent.value,
      annualRate: annualRate.value,
      termYears: termYears.value,
      additionalContribution: additionalContribution.value,
      monthlyCosts: monthlyCosts.value,
      oneTimeFees: oneTimeFees.value,
      earlyPayment: earlyPayment.value,
      extraMonthlyPayment: extraMonthlyPayment.value,
    })
  })

  function getIssue(field: MortgageInputField): MortgageValidationIssue | undefined {
    return issues.value.find(issue => issue.field === field)
  }

  return {
    propertyPrice,
    downPaymentPercent,
    annualRate,
    termYears,
    additionalContribution,
    monthlyCosts,
    oneTimeFees,
    earlyPayment,
    extraMonthlyPayment,
    issues,
    result,
    getIssue,
  }
}
