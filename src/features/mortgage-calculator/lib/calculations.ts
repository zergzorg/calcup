import type { MortgageInput, MortgageResult, MortgageScheduleRow } from '../types/mortgage'

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

export function calculateExtendedMortgagePrincipal(
  propertyPrice: number,
  downPaymentPercent: number,
  additionalContribution: number,
  earlyPayment: number,
): number | null {
  const principal = calculateMortgagePrincipal(propertyPrice, downPaymentPercent)
  if (principal === null) return null
  if (!Number.isFinite(additionalContribution) || additionalContribution < 0) return null
  if (!Number.isFinite(earlyPayment) || earlyPayment < 0) return null

  const nextPrincipal = principal - additionalContribution - earlyPayment
  return nextPrincipal > 0 ? roundMoney(nextPrincipal) : null
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

export function buildPaymentSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  monthlyPayment: number,
  extraMonthlyPayment: number,
): MortgageScheduleRow[] | null {
  if (!Number.isFinite(extraMonthlyPayment) || extraMonthlyPayment < 0) return null

  const monthlyRate = annualRate / 100 / 12
  const rows: MortgageScheduleRow[] = []
  let balance = principal
  let month = 0

  while (balance > 0.01 && month < termMonths) {
    month += 1
    const interest = roundMoney(balance * monthlyRate)
    const payment = Math.min(roundMoney(monthlyPayment + extraMonthlyPayment), roundMoney(balance + interest))
    const principalPaid = roundMoney(payment - interest)
    balance = roundMoney(Math.max(0, balance - principalPaid))

    rows.push({
      month,
      payment,
      principal: principalPaid,
      interest,
      balance,
    })
  }

  return rows
}

export function calculateMortgage(input: MortgageInput): MortgageResult | null {
  if (!Number.isFinite(input.propertyPrice) || input.propertyPrice <= 0) return null
  if (!Number.isFinite(input.downPaymentPercent) || input.downPaymentPercent < 0 || input.downPaymentPercent >= 100) return null
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0) return null
  if (!Number.isFinite(input.termYears) || input.termYears <= 0) return null
  if (!Number.isFinite(input.monthlyCosts) || input.monthlyCosts < 0) return null
  if (!Number.isFinite(input.oneTimeFees) || input.oneTimeFees < 0) return null
  if (!Number.isFinite(input.extraMonthlyPayment) || input.extraMonthlyPayment < 0) return null

  const termMonths = Math.round(input.termYears * 12)
  if (termMonths <= 0) return null

  const downPaymentAmount = calculateDownPaymentAmount(input.propertyPrice, input.downPaymentPercent)
  const basePrincipal = calculateMortgagePrincipal(input.propertyPrice, input.downPaymentPercent)
  const principal = calculateExtendedMortgagePrincipal(
    input.propertyPrice,
    input.downPaymentPercent,
    input.additionalContribution,
    input.earlyPayment,
  )
  if (downPaymentAmount === null || basePrincipal === null || principal === null) return null

  const monthlyPayment = calculateMonthlyPayment(principal, input.annualRate, termMonths)
  if (monthlyPayment === null) return null

  const schedule = buildPaymentSchedule(
    principal,
    input.annualRate,
    termMonths,
    monthlyPayment,
    input.extraMonthlyPayment,
  )
  if (schedule === null || schedule.length === 0) return null

  const totalPayment = roundMoney(schedule.reduce((sum, row) => sum + row.payment, 0))
  const overpayment = roundMoney(totalPayment - principal)
  const baseMonthlyPayment = calculateMonthlyPayment(basePrincipal, input.annualRate, termMonths)
  if (baseMonthlyPayment === null) return null
  const baseOverpayment = roundMoney(baseMonthlyPayment * termMonths - basePrincipal)
  const actualTermMonths = schedule.length
  const monthlyCashOut = roundMoney(monthlyPayment + input.extraMonthlyPayment + input.monthlyCosts)
  const totalCashOut = roundMoney(
    downPaymentAmount +
    input.additionalContribution +
    input.earlyPayment +
    input.oneTimeFees +
    totalPayment +
    input.monthlyCosts * actualTermMonths,
  )

  return {
    propertyPrice: roundMoney(input.propertyPrice),
    downPaymentAmount,
    additionalContribution: roundMoney(input.additionalContribution),
    principal,
    termMonths,
    monthlyPayment,
    monthlyCashOut,
    totalPayment,
    totalCashOut,
    overpayment,
    baseOverpayment,
    savedInterest: roundMoney(Math.max(0, baseOverpayment - overpayment)),
    actualTermMonths,
    oneTimeFees: roundMoney(input.oneTimeFees),
    earlyPayment: roundMoney(input.earlyPayment),
    extraMonthlyPayment: roundMoney(input.extraMonthlyPayment),
    loanToValuePercent: roundMoney(principal / input.propertyPrice * 100),
    schedulePreview: schedule.slice(0, 12),
  }
}
