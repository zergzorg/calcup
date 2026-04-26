import { describe, expect, it } from 'vitest'
import { convertCurrency, isValidAmount, isValidRate, roundCurrency, roundRate } from './calculations'

describe('currency converter calculations', () => {
  it('converts by a manual direct rate', () => {
    expect(convertCurrency(100, 90)).toEqual({ converted: 9000, rate: 90 })
  })

  it('rounds converted money to two decimals', () => {
    expect(convertCurrency(123.45, 0.0111)?.converted).toBe(1.37)
    expect(roundCurrency(10.005)).toBe(10.01)
  })

  it('keeps enough precision for reverse exchange rates', () => {
    expect(roundRate(1 / 98)).toBe(0.010204)
  })

  it('allows zero amount', () => {
    expect(convertCurrency(0, 90)).toEqual({ converted: 0, rate: 90 })
  })

  it('rejects invalid amount', () => {
    expect(convertCurrency(-1, 90)).toBeNull()
    expect(convertCurrency(Number.NaN, 90)).toBeNull()
    expect(isValidAmount(Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('rejects invalid rate', () => {
    expect(convertCurrency(100, 0)).toBeNull()
    expect(convertCurrency(100, -1)).toBeNull()
    expect(convertCurrency(100, Number.NaN)).toBeNull()
    expect(isValidRate(Number.POSITIVE_INFINITY)).toBe(false)
  })
})
