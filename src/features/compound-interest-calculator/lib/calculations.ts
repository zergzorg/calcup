import type { CompoundInterestInput, CompoundInterestResult } from '../types/compoundInterest'

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateOwnContributions(initialAmount: number, monthlyContribution: number, termMonths: number): number | null {
  if (!Number.isFinite(initialAmount) || !Number.isFinite(monthlyContribution) || !Number.isFinite(termMonths)) return null
  if (initialAmount < 0 || monthlyContribution < 0 || termMonths <= 0) return null

  return roundMoney(initialAmount + monthlyContribution * Math.round(termMonths))
}

export function calculateFutureValue(input: CompoundInterestInput): number | null {
  if (!Number.isFinite(input.initialAmount) || input.initialAmount < 0) return null
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution < 0) return null
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0) return null
  if (!Number.isFinite(input.termYears) || input.termYears <= 0) return null

  const termMonths = Math.round(input.termYears * 12)
  if (termMonths <= 0) return null

  const ownContributions = calculateOwnContributions(input.initialAmount, input.monthlyContribution, termMonths)
  if (ownContributions === null || ownContributions <= 0) return null

  const monthlyRate = input.annualRate / 100 / 12
  let balance = input.initialAmount

  for (let month = 0; month < termMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + input.monthlyContribution
  }

  return roundMoney(balance)
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult | null {
  const termMonths = Math.round(input.termYears * 12)
  if (termMonths <= 0) return null

  const ownContributions = calculateOwnContributions(input.initialAmount, input.monthlyContribution, termMonths)
  const finalAmount = calculateFutureValue(input)
  if (ownContributions === null || finalAmount === null || ownContributions <= 0) return null

  const interestEarned = roundMoney(finalAmount - ownContributions)

  return {
    initialAmount: roundMoney(input.initialAmount),
    monthlyContribution: roundMoney(input.monthlyContribution),
    annualRate: input.annualRate,
    termYears: input.termYears,
    termMonths,
    ownContributions,
    interestEarned,
    finalAmount,
    effectiveGrowthPercent: roundMoney(interestEarned / ownContributions * 100),
  }
}
