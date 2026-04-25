import type {
  HourlyRateInput,
  HourlyRateResult,
  MonthlyTaxBreakdownItem,
  SalaryTaxMode,
  ScheduleType,
} from '../types/hourly-rate'

export const WORK_DAYS_PER_YEAR: Record<Exclude<ScheduleType, 'custom'>, number> = {
  fiveTwo: 247,
  twoTwo: 183,
  dayThree: 92,
}

const MONTHS_PER_YEAR = 12

export const RUSSIA_NDFL_BRACKETS = [
  { limit: 2_400_000, rate: 0.13 },
  { limit: 5_000_000, rate: 0.15 },
  { limit: 20_000_000, rate: 0.18 },
  { limit: 50_000_000, rate: 0.20 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.22 },
]

export function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function getWorkDaysPerYear(
  scheduleType: ScheduleType,
  customWorkDaysPerYear?: number,
): number | null {
  if (scheduleType === 'custom') {
    if (!isValidPositiveNumber(customWorkDaysPerYear ?? Number.NaN)) return null
    if ((customWorkDaysPerYear ?? 0) > 366) return null
    return customWorkDaysPerYear ?? null
  }

  return WORK_DAYS_PER_YEAR[scheduleType]
}

export function calculateAverageWorkDaysPerMonth(workDaysPerYear: number): number | null {
  if (!isValidPositiveNumber(workDaysPerYear)) return null
  return workDaysPerYear / MONTHS_PER_YEAR
}

export function calculateAverageWorkHoursPerMonth(
  workDaysPerYear: number,
  hoursPerWorkDay: number,
): number | null {
  if (!isValidPositiveNumber(hoursPerWorkDay) || hoursPerWorkDay > 24) return null
  const averageWorkDaysPerMonth = calculateAverageWorkDaysPerMonth(workDaysPerYear)
  if (averageWorkDaysPerMonth === null) return null
  return averageWorkDaysPerMonth * hoursPerWorkDay
}

export function calculateBaseHourlyRate(
  monthlySalaryAfterTax: number,
  workDaysPerYear: number,
  hoursPerWorkDay: number,
): number | null {
  if (!isValidPositiveNumber(monthlySalaryAfterTax)) return null
  const averageWorkHoursPerMonth = calculateAverageWorkHoursPerMonth(workDaysPerYear, hoursPerWorkDay)
  if (averageWorkHoursPerMonth === null || averageWorkHoursPerMonth === 0) return null
  return monthlySalaryAfterTax / averageWorkHoursPerMonth
}

export function calculateProgressiveNdfl(annualIncome: number): number | null {
  if (!isValidNonNegativeNumber(annualIncome)) return null

  let previousLimit = 0
  let tax = 0

  for (const bracket of RUSSIA_NDFL_BRACKETS) {
    if (annualIncome <= previousLimit) break
    const taxablePart = Math.min(annualIncome, bracket.limit) - previousLimit
    tax += taxablePart * bracket.rate
    previousLimit = bracket.limit
  }

  return tax
}

export function calculateMonthlyProgressiveNdflBreakdown(
  monthlySalary: number,
): MonthlyTaxBreakdownItem[] | null {
  if (!isValidPositiveNumber(monthlySalary)) return null

  const breakdown: MonthlyTaxBreakdownItem[] = []
  let previousCumulativeTax = 0

  for (let month = 1; month <= MONTHS_PER_YEAR; month += 1) {
    const cumulativeIncome = monthlySalary * month
    const cumulativeTax = calculateProgressiveNdfl(cumulativeIncome)
    if (cumulativeTax === null) return null

    const taxAmount = cumulativeTax - previousCumulativeTax
    previousCumulativeTax = cumulativeTax

    breakdown.push({
      month,
      grossIncome: monthlySalary,
      cumulativeIncome,
      taxAmount,
      salaryAfterTax: monthlySalary - taxAmount,
      effectiveTaxPercent: taxAmount / monthlySalary * 100,
    })
  }

  return breakdown
}

export function calculateSalaryTaxAmount(
  monthlySalary: number,
  salaryTaxMode: SalaryTaxMode,
  customSalaryTaxPercent: number,
): number | null {
  if (!isValidPositiveNumber(monthlySalary)) return null

  if (salaryTaxMode === 'custom') {
    if (!isValidNonNegativeNumber(customSalaryTaxPercent) || customSalaryTaxPercent > 100) return null
    return monthlySalary * customSalaryTaxPercent / 100
  }

  const annualTax = calculateProgressiveNdfl(monthlySalary * MONTHS_PER_YEAR)
  if (annualTax === null) return null
  return annualTax / MONTHS_PER_YEAR
}

export function calculateMonthlySalaryAfterTax(
  monthlySalary: number,
  salaryTaxMode: SalaryTaxMode,
  customSalaryTaxPercent: number,
): number | null {
  const taxAmount = calculateSalaryTaxAmount(monthlySalary, salaryTaxMode, customSalaryTaxPercent)
  if (taxAmount === null) return null
  return monthlySalary - taxAmount
}

export function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult | null {
  if (!isValidPositiveNumber(input.monthlySalary)) return null
  for (const item of input.additionalIncomes) {
    if (!isValidNonNegativeNumber(item.amount)) return null
    if (!isValidNonNegativeNumber(item.taxPercent) || item.taxPercent > 100) return null
  }
  if (input.salaryTaxMode === 'custom') {
    if (!isValidNonNegativeNumber(input.customSalaryTaxPercent)) return null
    if (input.customSalaryTaxPercent > 100) return null
  }
  if (!isValidPositiveNumber(input.hoursPerWorkDay) || input.hoursPerWorkDay > 24) return null

  const workDaysPerYear = getWorkDaysPerYear(input.scheduleType, input.customWorkDaysPerYear)
  if (workDaysPerYear === null) return null

  const averageWorkDaysPerMonth = calculateAverageWorkDaysPerMonth(workDaysPerYear)
  const averageWorkHoursPerMonth = calculateAverageWorkHoursPerMonth(
    workDaysPerYear,
    input.hoursPerWorkDay,
  )
  const salaryTaxAmount = calculateSalaryTaxAmount(
    input.monthlySalary,
    input.salaryTaxMode,
    input.customSalaryTaxPercent,
  )
  const monthlySalaryAfterTax = calculateMonthlySalaryAfterTax(
    input.monthlySalary,
    input.salaryTaxMode,
    input.customSalaryTaxPercent,
  )
  const additionalIncomeAmount = input.additionalIncomes.reduce((sum, item) => sum + item.amount, 0)
  const additionalIncomeTaxAmount = input.additionalIncomes.reduce(
    (sum, item) => sum + item.amount * item.taxPercent / 100,
    0,
  )
  const monthlyAdditionalIncomeAfterTax = additionalIncomeAmount - additionalIncomeTaxAmount
  const monthlyTotalIncomeAfterTax = monthlySalaryAfterTax === null
    ? null
    : monthlySalaryAfterTax + monthlyAdditionalIncomeAfterTax
  const monthlyTaxBreakdown = input.salaryTaxMode === 'russiaProgressive'
    ? calculateMonthlyProgressiveNdflBreakdown(input.monthlySalary)
    : []
  const baseHourlyRate = calculateBaseHourlyRate(
    monthlyTotalIncomeAfterTax ?? Number.NaN,
    workDaysPerYear,
    input.hoursPerWorkDay,
  )

  if (
    averageWorkDaysPerMonth === null
    || averageWorkHoursPerMonth === null
    || salaryTaxAmount === null
    || monthlySalaryAfterTax === null
    || monthlyTotalIncomeAfterTax === null
    || monthlyTaxBreakdown === null
    || baseHourlyRate === null
  ) {
    return null
  }

  const workDayPrice = baseHourlyRate * input.hoursPerWorkDay

  return {
    workDaysPerYear,
    averageWorkDaysPerMonth,
    averageWorkHoursPerMonth,
    annualGrossSalary: input.monthlySalary * MONTHS_PER_YEAR,
    annualAdditionalIncome: additionalIncomeAmount * MONTHS_PER_YEAR,
    salaryTaxAmount,
    additionalIncomeTaxAmount,
    salaryTaxPercent: input.monthlySalary === 0 ? 0 : salaryTaxAmount / input.monthlySalary * 100,
    monthlySalaryAfterTax,
    monthlyTotalIncomeAfterTax,
    baseHourlyRate,
    workDayPrice,
    monthlyTaxBreakdown,
  }
}
