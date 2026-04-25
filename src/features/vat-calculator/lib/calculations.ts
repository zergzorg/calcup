import type { VatAddResult, VatExtractResult } from '../types/vat'

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidRate(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function addVat(amountWithoutVat: number, rate: number): VatAddResult | null {
  if (!isValidAmount(amountWithoutVat) || !isValidRate(rate)) return null
  const vatAmount = round2(amountWithoutVat * rate / 100)
  const amountWithVat = round2(amountWithoutVat + vatAmount)
  return { vatAmount, amountWithVat }
}

export function extractVat(amountWithVat: number, rate: number): VatExtractResult | null {
  if (!isValidAmount(amountWithVat) || !isValidRate(rate)) return null
  // For 0% rate: no VAT in the amount
  if (rate === 0) return { vatAmount: 0, amountWithoutVat: amountWithVat }
  const amountWithoutVat = round2(amountWithVat / (1 + rate / 100))
  const vatAmount = round2(amountWithVat - amountWithoutVat)
  return { vatAmount, amountWithoutVat }
}
