import type { BillSplitInput, BillSplitResult } from '../types/bill-split'

export const TIP_PRESETS = [0, 10, 15] as const
export const ROUNDING_PRESETS = [0.01, 1, 10] as const

const EPSILON = 1e-9

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidBillSplitInput(input: BillSplitInput): boolean {
  return Number.isFinite(input.billAmount)
    && input.billAmount >= 0
    && Number.isInteger(input.peopleCount)
    && input.peopleCount >= 1
    && Number.isFinite(input.tipPercent)
    && input.tipPercent >= 0
    && Number.isFinite(input.serviceFee)
    && input.serviceFee >= 0
    && Number.isFinite(input.roundTo)
    && input.roundTo > 0
}

export function calculateBillSplit(input: BillSplitInput): BillSplitResult | null {
  if (!isValidBillSplitInput(input)) {
    return null
  }

  const billAmount = roundMoney(input.billAmount)
  const serviceFee = roundMoney(input.serviceFee)
  const tipAmount = roundMoney(billAmount * input.tipPercent / 100)
  const totalAmount = roundMoney(billAmount + tipAmount + serviceFee)
  const exactPerPerson = totalAmount / input.peopleCount
  const roundedPerPerson = roundMoney(Math.ceil((exactPerPerson - EPSILON) / input.roundTo) * input.roundTo)
  const collectedTotal = roundMoney(roundedPerPerson * input.peopleCount)
  const roundingReserve = roundMoney(collectedTotal - totalAmount)

  return {
    billAmount,
    tipAmount,
    serviceFee,
    totalAmount,
    exactPerPerson: roundMoney(exactPerPerson),
    roundedPerPerson,
    collectedTotal,
    roundingReserve,
  }
}
