export type ScheduleType = 'fiveTwo' | 'twoTwo' | 'dayThree' | 'custom'
export type SalaryTaxMode = 'russiaProgressive' | 'custom'

export interface SalaryInput {
  monthlySalary: number
  salaryTaxMode: SalaryTaxMode
  customSalaryTaxPercent: number
  additionalIncomes: AdditionalIncomeInput[]
  scheduleType: ScheduleType
  hoursPerWorkDay: number
  customWorkDaysPerYear?: number
}

export interface SalaryResult {
  workDaysPerYear: number
  averageWorkDaysPerMonth: number
  averageWorkHoursPerMonth: number
  annualGrossSalary: number
  annualAdditionalIncome: number
  salaryTaxAmount: number
  additionalIncomeTaxAmount: number
  monthlyTotalIncomeAfterTax: number
  salaryTaxPercent: number
  monthlySalaryAfterTax: number
  baseSalary: number
  workDayPrice: number
  monthlyTaxBreakdown: MonthlyTaxBreakdownItem[]
}

export interface AdditionalIncomeInput {
  amount: number
  taxPercent: number
}

export interface MonthlyTaxBreakdownItem {
  month: number
  grossIncome: number
  cumulativeIncome: number
  taxAmount: number
  salaryAfterTax: number
  effectiveTaxPercent: number
}

export interface SalaryValidationIssue {
  field:
    | 'monthlySalary'
    | 'customSalaryTaxPercent'
    | `additionalIncome.${number}.amount`
    | `additionalIncome.${number}.taxPercent`
    | 'hoursPerWorkDay'
    | 'customWorkDaysPerYear'
  messageKey: string
}
