import { describe, it, expect } from 'vitest'
import { convertArea, roundArea, isValidAreaValue } from './calculations'

describe('isValidAreaValue', () => {
  it('accepts zero', () => { expect(isValidAreaValue(0)).toBe(true) })
  it('accepts positive finite numbers', () => { expect(isValidAreaValue(100)).toBe(true) })
  it('rejects negative values', () => { expect(isValidAreaValue(-1)).toBe(false) })
  it('rejects NaN', () => { expect(isValidAreaValue(NaN)).toBe(false) })
  it('rejects Infinity', () => { expect(isValidAreaValue(Infinity)).toBe(false) })
})

describe('roundArea', () => {
  it('returns NaN for non-finite input', () => { expect(roundArea(NaN)).toBeNaN() })
  it('returns 0 for zero', () => { expect(roundArea(0)).toBe(0) })
  it('preserves reasonable precision', () => {
    expect(roundArea(1.23456789012)).toBeCloseTo(1.2345679, 7)
  })
})

describe('convertArea', () => {
  it('returns same value when units are equal', () => {
    expect(convertArea(5, 'squareMeter', 'squareMeter')).toBe(5)
  })

  it('zero converts to zero', () => {
    expect(convertArea(0, 'squareMeter', 'hectare')).toBe(0)
  })

  it('returns null for negative value', () => {
    expect(convertArea(-1, 'squareMeter', 'hectare')).toBeNull()
  })

  it('returns null for NaN', () => {
    expect(convertArea(NaN, 'squareMeter', 'hectare')).toBeNull()
  })

  // Metric
  it('1 м² = 10 000 см²', () => {
    expect(convertArea(1, 'squareMeter', 'squareCentimeter')).toBeCloseTo(10_000, 4)
  })

  it('1 км² = 1 000 000 м²', () => {
    expect(convertArea(1, 'squareKilometer', 'squareMeter')).toBeCloseTo(1_000_000, 0)
  })

  it('1 гектар = 10 000 м²', () => {
    expect(convertArea(1, 'hectare', 'squareMeter')).toBeCloseTo(10_000, 0)
  })

  it('1 сотка/ар = 100 м²', () => {
    expect(convertArea(1, 'are', 'squareMeter')).toBeCloseTo(100, 0)
  })

  it('1 гектар = 100 соток', () => {
    expect(convertArea(1, 'hectare', 'are')).toBeCloseTo(100, 0)
  })

  it('1 км² = 100 гектар', () => {
    expect(convertArea(1, 'squareKilometer', 'hectare')).toBeCloseTo(100, 0)
  })

  it('1 мм² → м²', () => {
    expect(convertArea(1, 'squareMillimeter', 'squareMeter')).toBeCloseTo(0.000001, 10)
  })

  // Imperial
  it('1 акр ≈ 4046.856 м²', () => {
    const r = convertArea(1, 'acre', 'squareMeter')
    expect(r).not.toBeNull()
    expect(r!).toBeCloseTo(4046.8564224, 3)
  })

  it('1 фут² ≈ 0.09290304 м²', () => {
    const r = convertArea(1, 'squareFoot', 'squareMeter')
    expect(r!).toBeCloseTo(0.09290304, 7)
  })

  it('1 м² ≈ 10.7639 фут²', () => {
    const r = convertArea(1, 'squareMeter', 'squareFoot')
    expect(r!).toBeCloseTo(10.7639, 4)
  })

  it('1 ярд² ≈ 0.8361 м²', () => {
    const r = convertArea(1, 'squareYard', 'squareMeter')
    expect(r!).toBeCloseTo(0.83612736, 6)
  })

  it('1 дюйм² → м²', () => {
    const r = convertArea(1, 'squareInch', 'squareMeter')
    expect(r!).toBeCloseTo(0.00064516, 8)
  })

  // Cross conversions
  it('1 акр ≈ 0.404686 гектар', () => {
    const r = convertArea(1, 'acre', 'hectare')
    expect(r!).toBeCloseTo(0.404686, 5)
  })

  it('10 000 м² = 1 гектар', () => {
    expect(convertArea(10_000, 'squareMeter', 'hectare')).toBeCloseTo(1, 6)
  })

  it('100 м² = 1 сотка', () => {
    expect(convertArea(100, 'squareMeter', 'are')).toBeCloseTo(1, 6)
  })
})
