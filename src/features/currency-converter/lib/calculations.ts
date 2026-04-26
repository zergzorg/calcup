import type { CurrencyCode, CurrencyConversionResult, CurrencyPresetPair } from '../types/currency'

export const CURRENCIES: CurrencyCode[] = ['RUB', 'USD', 'EUR', 'CNY']

export const PRESET_PAIRS: CurrencyPresetPair[] = [
  { id: 'usd-rub', from: 'USD', to: 'RUB', rate: 90 },
  { id: 'eur-rub', from: 'EUR', to: 'RUB', rate: 98 },
  { id: 'cny-rub', from: 'CNY', to: 'RUB', rate: 12.5 },
  { id: 'rub-usd', from: 'RUB', to: 'USD', rate: 0.0111 },
]

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function roundRate(value: number): number {
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isValidRate(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function convertCurrency(amount: number, rate: number): CurrencyConversionResult | null {
  if (!isValidAmount(amount) || !isValidRate(rate)) {
    return null
  }

  return {
    converted: roundCurrency(amount * rate),
    rate,
  }
}
