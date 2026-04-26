import type { RefinanceInput, RefinanceResult } from '../types/refinance'

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number | null {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(termMonths)) return null
  if (principal <= 0 || annualRate < 0 || termMonths <= 0) return null

  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return roundMoney(principal / termMonths)

  const factor = (1 + monthlyRate) ** Math.round(termMonths)
  return roundMoney(principal * monthlyRate * factor / (factor - 1))
}

export function calculateRefinance(input: RefinanceInput): RefinanceResult | null {
  if (!Number.isFinite(input.outstandingBalance) || input.outstandingBalance <= 0) return null
  if (!Number.isFinite(input.oldAnnualRate) || input.oldAnnualRate < 0) return null
  if (!Number.isFinite(input.oldTermMonths) || input.oldTermMonths <= 0) return null
  if (!Number.isFinite(input.newAnnualRate) || input.newAnnualRate < 0) return null
  if (!Number.isFinite(input.newTermMonths) || input.newTermMonths <= 0) return null
  if (!Number.isFinite(input.refinancingCost) || input.refinancingCost < 0) return null

  const oldTermMonths = Math.round(input.oldTermMonths)
  const newTermMonths = Math.round(input.newTermMonths)
  const oldMonthlyPayment = calculateMonthlyPayment(input.outstandingBalance, input.oldAnnualRate, oldTermMonths)
  const newMonthlyPayment = calculateMonthlyPayment(input.outstandingBalance, input.newAnnualRate, newTermMonths)
  if (oldMonthlyPayment === null || newMonthlyPayment === null) return null

  const oldTotalPayment = roundMoney(oldMonthlyPayment * oldTermMonths)
  const newTotalPayment = roundMoney(newMonthlyPayment * newTermMonths + input.refinancingCost)
  const totalSavings = roundMoney(oldTotalPayment - newTotalPayment)
  const monthlySavings = roundMoney(oldMonthlyPayment - newMonthlyPayment)
  const paybackMonths = monthlySavings > 0 ? Math.ceil(input.refinancingCost / monthlySavings) : null

  return {
    outstandingBalance: roundMoney(input.outstandingBalance),
    oldMonthlyPayment,
    newMonthlyPayment,
    oldTotalPayment,
    newTotalPayment,
    totalSavings,
    monthlySavings,
    paybackMonths,
    isBeneficial: totalSavings > 0,
  }
}
