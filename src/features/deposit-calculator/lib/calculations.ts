import type { DepositInput, DepositResult } from '../types/deposit'

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateSimpleDepositIncome(initialAmount: number, annualRate: number, termMonths: number): number | null {
  if (!Number.isFinite(initialAmount) || !Number.isFinite(annualRate) || !Number.isFinite(termMonths)) return null
  if (initialAmount <= 0 || annualRate < 0 || termMonths <= 0) return null

  return roundMoney(initialAmount * annualRate / 100 * termMonths / 12)
}

export function calculateMonthlyCapitalizedAmount(initialAmount: number, annualRate: number, termMonths: number): number | null {
  if (!Number.isFinite(initialAmount) || !Number.isFinite(annualRate) || !Number.isFinite(termMonths)) return null
  if (initialAmount <= 0 || annualRate < 0 || termMonths <= 0) return null

  const monthlyRate = annualRate / 100 / 12
  return roundMoney(initialAmount * (1 + monthlyRate) ** Math.round(termMonths))
}

export function calculateDeposit(input: DepositInput): DepositResult | null {
  if (!Number.isFinite(input.initialAmount) || input.initialAmount <= 0) return null
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0) return null
  if (!Number.isFinite(input.termMonths) || input.termMonths <= 0) return null

  const termMonths = Math.round(input.termMonths)
  if (termMonths <= 0) return null

  if (input.mode === 'simple') {
    const income = calculateSimpleDepositIncome(input.initialAmount, input.annualRate, termMonths)
    if (income === null) return null

    const finalAmount = roundMoney(input.initialAmount + income)
    return {
      initialAmount: roundMoney(input.initialAmount),
      annualRate: input.annualRate,
      termMonths,
      mode: input.mode,
      income,
      finalAmount,
      effectiveGrowthPercent: roundMoney(income / input.initialAmount * 100),
    }
  }

  if (input.mode === 'monthlyCapitalization') {
    const finalAmount = calculateMonthlyCapitalizedAmount(input.initialAmount, input.annualRate, termMonths)
    if (finalAmount === null) return null

    const income = roundMoney(finalAmount - input.initialAmount)
    return {
      initialAmount: roundMoney(input.initialAmount),
      annualRate: input.annualRate,
      termMonths,
      mode: input.mode,
      income,
      finalAmount,
      effectiveGrowthPercent: roundMoney(income / input.initialAmount * 100),
    }
  }

  return null
}
