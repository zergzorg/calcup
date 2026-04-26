import type { MortgageInput, MortgageResult } from '../types/mortgage'

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateDownPaymentAmount(propertyPrice: number, downPaymentPercent: number): number | null {
  if (!Number.isFinite(propertyPrice) || !Number.isFinite(downPaymentPercent)) return null
  if (propertyPrice <= 0 || downPaymentPercent < 0 || downPaymentPercent >= 100) return null

  return roundMoney(propertyPrice * downPaymentPercent / 100)
}

export function calculateMortgagePrincipal(propertyPrice: number, downPaymentPercent: number): number | null {
  const downPaymentAmount = calculateDownPaymentAmount(propertyPrice, downPaymentPercent)
  if (downPaymentAmount === null) return null

  return roundMoney(propertyPrice - downPaymentAmount)
}

export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number | null {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(termMonths)) return null
  if (principal <= 0 || annualRate < 0 || termMonths <= 0) return null

  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) {
    return roundMoney(principal / termMonths)
  }

  const factor = (1 + monthlyRate) ** termMonths
  return roundMoney(principal * monthlyRate * factor / (factor - 1))
}

export function calculateMortgage(input: MortgageInput): MortgageResult | null {
  if (!Number.isFinite(input.propertyPrice) || input.propertyPrice <= 0) return null
  if (!Number.isFinite(input.downPaymentPercent) || input.downPaymentPercent < 0 || input.downPaymentPercent >= 100) return null
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0) return null
  if (!Number.isFinite(input.termYears) || input.termYears <= 0) return null

  const termMonths = Math.round(input.termYears * 12)
  if (termMonths <= 0) return null

  const downPaymentAmount = calculateDownPaymentAmount(input.propertyPrice, input.downPaymentPercent)
  const principal = calculateMortgagePrincipal(input.propertyPrice, input.downPaymentPercent)
  if (downPaymentAmount === null || principal === null) return null

  const monthlyPayment = calculateMonthlyPayment(principal, input.annualRate, termMonths)
  if (monthlyPayment === null) return null

  const totalPayment = roundMoney(monthlyPayment * termMonths)
  const overpayment = roundMoney(totalPayment - principal)

  return {
    propertyPrice: roundMoney(input.propertyPrice),
    downPaymentAmount,
    principal,
    termMonths,
    monthlyPayment,
    totalPayment,
    overpayment,
    loanToValuePercent: roundMoney(principal / input.propertyPrice * 100),
  }
}
