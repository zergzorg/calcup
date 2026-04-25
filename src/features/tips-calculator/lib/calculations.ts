import type { TipResult } from '../types/tips'

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidPercent(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidPeopleCount(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 1
}

export function calculateTips(
  billAmount: number,
  tipPercent: number,
  peopleCount: number,
): TipResult | null {
  if (!isValidAmount(billAmount)) return null
  if (!isValidPercent(tipPercent)) return null
  if (!isValidPeopleCount(peopleCount)) return null

  const tipAmount = round2(billAmount * tipPercent / 100)
  const totalAmount = round2(billAmount + tipAmount)
  const amountPerPerson = round2(totalAmount / peopleCount)
  const tipPerPerson = round2(tipAmount / peopleCount)
  const billPerPerson = round2(billAmount / peopleCount)

  return { tipAmount, totalAmount, amountPerPerson, tipPerPerson, billPerPerson }
}
