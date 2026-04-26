export type FinanceMvpCalculatorId = 'budget' | 'inflation' | 'tax-deduction' | 'debt-load' | 'rent-vs-buy'
export type FinanceMvpInput = Record<string, number>

export interface FinanceMvpResultRow {
  key: string
  value: number
  unit: 'money' | 'number' | 'percent'
}

export interface FinanceMvpResult {
  primary: FinanceMvpResultRow
  rows: FinanceMvpResultRow[]
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function roundNumber(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

function valid(values: number[], allowNegative = false): boolean {
  return values.every(value => Number.isFinite(value) && (allowNegative || value >= 0))
}

export function calculateBudget(input: FinanceMvpInput): FinanceMvpResult | null {
  const { income, expenses, debtPayments, savings } = input
  if (!valid([income, expenses, debtPayments, savings])) return null

  const totalOut = roundMoney(expenses + debtPayments + savings)
  const freeCash = roundMoney(income - totalOut)
  const savingsRate = income > 0 ? roundNumber(savings / income * 100) : 0

  return {
    primary: { key: 'freeCash', value: freeCash, unit: 'money' },
    rows: [
      { key: 'totalOut', value: totalOut, unit: 'money' },
      { key: 'savingsRate', value: savingsRate, unit: 'percent' },
      { key: 'debtShare', value: income > 0 ? roundNumber(debtPayments / income * 100) : 0, unit: 'percent' },
    ],
  }
}

export function calculateInflation(input: FinanceMvpInput): FinanceMvpResult | null {
  const { amount, inflationRate, years, nominalReturn } = input
  if (!valid([amount, inflationRate, years, nominalReturn])) return null

  const inflationFactor = (1 + inflationRate / 100) ** years
  const futureCost = roundMoney(amount * inflationFactor)
  const purchasingPower = roundMoney(amount / inflationFactor)
  const realReturn = roundNumber(((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100)

  return {
    primary: { key: 'futureCost', value: futureCost, unit: 'money' },
    rows: [
      { key: 'purchasingPower', value: purchasingPower, unit: 'money' },
      { key: 'realReturn', value: realReturn, unit: 'percent' },
      { key: 'growth', value: roundMoney(futureCost - amount), unit: 'money' },
    ],
  }
}

export function calculateTaxDeduction(input: FinanceMvpInput): FinanceMvpResult | null {
  const { expenses, limit, ratePercent, taxPaid } = input
  if (!valid([expenses, limit, ratePercent, taxPaid])) return null
  if (ratePercent > 100) return null

  const base = Math.min(expenses, limit)
  const refund = roundMoney(Math.min(base * ratePercent / 100, taxPaid))

  return {
    primary: { key: 'refund', value: refund, unit: 'money' },
    rows: [
      { key: 'base', value: roundMoney(base), unit: 'money' },
      { key: 'unusedExpenses', value: roundMoney(Math.max(0, expenses - limit)), unit: 'money' },
      { key: 'rate', value: ratePercent, unit: 'percent' },
    ],
  }
}

export function calculateDebtLoad(input: FinanceMvpInput): FinanceMvpResult | null {
  const { monthlyIncome, creditPayments, otherDebtPayments } = input
  if (!valid([monthlyIncome, creditPayments, otherDebtPayments]) || monthlyIncome <= 0) return null

  const payments = roundMoney(creditPayments + otherDebtPayments)
  const load = roundNumber(payments / monthlyIncome * 100)

  return {
    primary: { key: 'load', value: load, unit: 'percent' },
    rows: [
      { key: 'payments', value: payments, unit: 'money' },
      { key: 'freeIncome', value: roundMoney(monthlyIncome - payments), unit: 'money' },
    ],
  }
}

export function calculateRentVsBuy(input: FinanceMvpInput): FinanceMvpResult | null {
  const { rent, mortgagePayment, ownershipCosts, horizonYears, downPayment } = input
  if (!valid([rent, mortgagePayment, ownershipCosts, horizonYears, downPayment]) || horizonYears <= 0) return null

  const months = Math.round(horizonYears * 12)
  const rentTotal = roundMoney(rent * months)
  const buyCashOut = roundMoney(downPayment + (mortgagePayment + ownershipCosts) * months)
  const difference = roundMoney(rentTotal - buyCashOut)

  return {
    primary: { key: difference >= 0 ? 'buyAdvantage' : 'rentAdvantage', value: Math.abs(difference), unit: 'money' },
    rows: [
      { key: 'rentTotal', value: rentTotal, unit: 'money' },
      { key: 'buyCashOut', value: buyCashOut, unit: 'money' },
      { key: 'months', value: months, unit: 'number' },
    ],
  }
}

export function calculateFinanceMvp(id: FinanceMvpCalculatorId, input: FinanceMvpInput): FinanceMvpResult | null {
  switch (id) {
    case 'budget':
      return calculateBudget(input)
    case 'inflation':
      return calculateInflation(input)
    case 'tax-deduction':
      return calculateTaxDeduction(input)
    case 'debt-load':
      return calculateDebtLoad(input)
    case 'rent-vs-buy':
      return calculateRentVsBuy(input)
    default:
      return null
  }
}
