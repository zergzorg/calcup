import type { DiscountResult, MarkupResult, FindPercentResult, FindOriginalResult } from '../types/discount'

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidPrice(v: number): boolean {
  return Number.isFinite(v) && v >= 0
}

export function isValidPositivePrice(v: number): boolean {
  return Number.isFinite(v) && v > 0
}

export function isValidPercent(v: number): boolean {
  return Number.isFinite(v) && v >= 0
}

export function calcDiscount(originalPrice: number, discountPercent: number): DiscountResult | null {
  if (!isValidPrice(originalPrice) || !isValidPercent(discountPercent)) return null
  const discountAmount = round2(originalPrice * discountPercent / 100)
  const finalPrice = round2(originalPrice - discountAmount)
  return { mode: 'discount', discountAmount, finalPrice }
}

export function calcMarkup(originalPrice: number, markupPercent: number): MarkupResult | null {
  if (!isValidPrice(originalPrice) || !isValidPercent(markupPercent)) return null
  const markupAmount = round2(originalPrice * markupPercent / 100)
  const finalPrice = round2(originalPrice + markupAmount)
  return { mode: 'markup', markupAmount, finalPrice }
}

export function calcFindPercent(oldPrice: number, newPrice: number): FindPercentResult | null {
  if (!isValidPositivePrice(oldPrice) || !isValidPrice(newPrice)) return null
  const changePercent = round2((newPrice - oldPrice) / oldPrice * 100)
  const direction = changePercent < 0 ? 'discount' : changePercent > 0 ? 'markup' : 'same'
  return { mode: 'findPercent', changePercent, direction }
}

export function calcFindOriginal(finalPrice: number, discountPercent: number): FindOriginalResult | null {
  if (!isValidPrice(finalPrice) || !isValidPercent(discountPercent)) return null
  if (discountPercent >= 100) return null
  const originalPrice = round2(finalPrice / (1 - discountPercent / 100))
  const discountAmount = round2(originalPrice - finalPrice)
  return { mode: 'findOriginal', originalPrice, discountAmount }
}
