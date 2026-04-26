export interface VacationPayInput {
  earnings: number
  fullMonths: number
  partialMonthDays: number
  vacationDays: number
  taxPercent: number
}

export interface VacationPayResult {
  accountingDays: number
  averageDailyEarnings: number
  grossVacationPay: number
  taxAmount: number
  netVacationPay: number
}

export interface VacationPayValidationIssue {
  field: keyof VacationPayInput
  messageKey: string
}
