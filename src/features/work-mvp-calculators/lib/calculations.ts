export type WorkMvpCalculatorId =
  | 'usn-tax'
  | 'ip-insurance'
  | 'penalty-interest'
  | 'dismissal-pay'
  | 'work-hours-month'
  | 'work-experience'

export type WorkMvpInput = Record<string, number>

export interface WorkMvpResultRow {
  key: string
  value: number
  unit: 'money' | 'number' | 'days' | 'hours' | 'percent'
}

export interface WorkMvpResult {
  primary: WorkMvpResultRow
  rows: WorkMvpResultRow[]
}

export const IP_FIXED_INSURANCE_2026 = 57_390
export const IP_EXTRA_THRESHOLD = 300_000
export const IP_EXTRA_MAX_2026 = 321_818

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function roundNumber(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isValidNumber(value: number): boolean {
  return Number.isFinite(value)
}

export function calculateUsnTax(input: WorkMvpInput): WorkMvpResult | null {
  const income = input.income
  const expenses = input.expenses
  const contributions = input.contributions
  if (![income, expenses, contributions].every(value => isValidNumber(value) && value >= 0)) return null

  const incomeTaxBeforeContributions = roundMoney(income * 0.06)
  const incomeTax = roundMoney(Math.max(0, incomeTaxBeforeContributions - contributions))
  const profit = Math.max(0, income - expenses)
  const profitTax = roundMoney(profit * 0.15)
  const minTax = roundMoney(income * 0.01)
  const incomeMinusExpensesTax = roundMoney(Math.max(profitTax, minTax))

  return {
    primary: { key: 'usnIncomeTax', value: incomeTax, unit: 'money' },
    rows: [
      { key: 'usnIncomeBeforeContributions', value: incomeTaxBeforeContributions, unit: 'money' },
      { key: 'usnIncomeMinusExpensesTax', value: incomeMinusExpensesTax, unit: 'money' },
      { key: 'minTax', value: minTax, unit: 'money' },
      { key: 'profit', value: profit, unit: 'money' },
    ],
  }
}

export function calculateIpInsurance(input: WorkMvpInput): WorkMvpResult | null {
  const income = input.income
  const activeMonths = input.activeMonths
  if (!isValidNumber(income) || income < 0) return null
  if (!isValidNumber(activeMonths) || activeMonths <= 0 || activeMonths > 12) return null

  const fixed = roundMoney(IP_FIXED_INSURANCE_2026 * activeMonths / 12)
  const extra = roundMoney(Math.min(Math.max(0, income - IP_EXTRA_THRESHOLD) * 0.01, IP_EXTRA_MAX_2026))
  const total = roundMoney(fixed + extra)

  return {
    primary: { key: 'total', value: total, unit: 'money' },
    rows: [
      { key: 'fixed', value: fixed, unit: 'money' },
      { key: 'extra', value: extra, unit: 'money' },
      { key: 'threshold', value: IP_EXTRA_THRESHOLD, unit: 'money' },
    ],
  }
}

export function calculatePenaltyInterest(input: WorkMvpInput): WorkMvpResult | null {
  const debt = input.debt
  const days = input.days
  const keyRate = input.keyRate
  const divisor = input.divisor
  if (![debt, days, keyRate, divisor].every(value => isValidNumber(value) && value >= 0)) return null
  if (debt <= 0 || days <= 0 || divisor <= 0) return null

  const penalty = roundMoney(debt * keyRate / 100 / divisor * days)

  return {
    primary: { key: 'penalty', value: penalty, unit: 'money' },
    rows: [
      { key: 'dailyPenalty', value: roundMoney(debt * keyRate / 100 / divisor), unit: 'money' },
      { key: 'totalDebt', value: roundMoney(debt + penalty), unit: 'money' },
      { key: 'rate', value: keyRate, unit: 'percent' },
    ],
  }
}

export function calculateDismissalPay(input: WorkMvpInput): WorkMvpResult | null {
  const averageDaily = input.averageDaily
  const unusedVacationDays = input.unusedVacationDays
  const severanceAverageMonthly = input.severanceAverageMonthly
  const severanceMonths = input.severanceMonths
  const taxPercent = input.taxPercent
  if (![averageDaily, unusedVacationDays, severanceAverageMonthly, severanceMonths, taxPercent].every(isValidNumber)) return null
  if (averageDaily < 0 || unusedVacationDays < 0 || severanceAverageMonthly < 0 || severanceMonths < 0) return null
  if (taxPercent < 0 || taxPercent > 100) return null

  const vacationCompensation = roundMoney(averageDaily * unusedVacationDays)
  const severance = roundMoney(severanceAverageMonthly * severanceMonths)
  const tax = roundMoney(vacationCompensation * taxPercent / 100)
  const totalGross = roundMoney(vacationCompensation + severance)
  const totalNet = roundMoney(totalGross - tax)

  return {
    primary: { key: 'net', value: totalNet, unit: 'money' },
    rows: [
      { key: 'gross', value: totalGross, unit: 'money' },
      { key: 'vacationCompensation', value: vacationCompensation, unit: 'money' },
      { key: 'severance', value: severance, unit: 'money' },
      { key: 'tax', value: tax, unit: 'money' },
    ],
  }
}

export function calculateWorkHoursMonth(input: WorkMvpInput): WorkMvpResult | null {
  const year = Math.trunc(input.year)
  const month = Math.trunc(input.month)
  const weeklyHours = input.weeklyHours
  if (!isValidNumber(year) || year < 1900 || year > 2100) return null
  if (!isValidNumber(month) || month < 1 || month > 12) return null
  if (!isValidNumber(weeklyHours) || weeklyHours <= 0 || weeklyHours > 80) return null

  const fixedHolidayKeys = new Set(['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '2-23', '3-8', '5-1', '5-9', '6-12', '11-4'])
  const daysInMonth = new Date(year, month, 0).getDate()
  let workdays = 0

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day)
    const weekday = date.getDay()
    const isWeekend = weekday === 0 || weekday === 6
    const isHoliday = fixedHolidayKeys.has(`${month}-${day}`)
    if (!isWeekend && !isHoliday) workdays += 1
  }

  const dailyHours = weeklyHours / 5
  const hours = roundNumber(workdays * dailyHours)

  return {
    primary: { key: 'hours', value: hours, unit: 'hours' },
    rows: [
      { key: 'workdays', value: workdays, unit: 'days' },
      { key: 'dailyHours', value: roundNumber(dailyHours), unit: 'hours' },
      { key: 'calendarDays', value: daysInMonth, unit: 'days' },
    ],
  }
}

export function calculateWorkExperience(input: WorkMvpInput): WorkMvpResult | null {
  const start = new Date(Math.trunc(input.startYear), Math.trunc(input.startMonth) - 1, Math.trunc(input.startDay))
  const end = new Date(Math.trunc(input.endYear), Math.trunc(input.endMonth) - 1, Math.trunc(input.endDay))
  if ([start.getTime(), end.getTime()].some(value => Number.isNaN(value))) return null
  if (end < start) return null

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86_400_000)

  return {
    primary: { key: 'years', value: years, unit: 'number' },
    rows: [
      { key: 'months', value: months, unit: 'number' },
      { key: 'days', value: days, unit: 'days' },
      { key: 'totalDays', value: totalDays, unit: 'days' },
    ],
  }
}

export function calculateWorkMvp(id: WorkMvpCalculatorId, input: WorkMvpInput): WorkMvpResult | null {
  switch (id) {
    case 'usn-tax':
      return calculateUsnTax(input)
    case 'ip-insurance':
      return calculateIpInsurance(input)
    case 'penalty-interest':
      return calculatePenaltyInterest(input)
    case 'dismissal-pay':
      return calculateDismissalPay(input)
    case 'work-hours-month':
      return calculateWorkHoursMonth(input)
    case 'work-experience':
      return calculateWorkExperience(input)
    default:
      return null
  }
}
