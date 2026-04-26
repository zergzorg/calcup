export interface ElectricityInput {
  powerW: number
  devicesCount: number
  hoursPerDay: number
  daysPerMonth: number
  tariffPerKwh: number
}

export interface ElectricityResult {
  powerKw: number
  dailyKwh: number
  monthlyKwh: number
  yearlyKwh: number
  dailyCost: number
  monthlyCost: number
  yearlyCost: number
}

export interface ElectricityValidationIssue {
  field: keyof ElectricityInput
  messageKey: string
}
