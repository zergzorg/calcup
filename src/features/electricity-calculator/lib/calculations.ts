import type { ElectricityInput, ElectricityResult } from '../types/electricity'

export function calculateElectricity(input: ElectricityInput): ElectricityResult | null {
  if (
    !isNonNegative(input.powerW)
    || !isPositiveInteger(input.devicesCount)
    || !isNonNegative(input.hoursPerDay)
    || input.hoursPerDay > 24
    || !isPositiveInteger(input.daysPerMonth)
    || input.daysPerMonth > 31
    || !isNonNegative(input.tariffPerKwh)
  ) {
    return null
  }

  const powerKw = input.powerW / 1000 * input.devicesCount
  const dailyKwh = powerKw * input.hoursPerDay
  const monthlyKwh = dailyKwh * input.daysPerMonth
  const yearlyKwh = dailyKwh * 365

  return {
    powerKw,
    dailyKwh,
    monthlyKwh,
    yearlyKwh,
    dailyCost: dailyKwh * input.tariffPerKwh,
    monthlyCost: monthlyKwh * input.tariffPerKwh,
    yearlyCost: yearlyKwh * input.tariffPerKwh,
  }
}

function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}
