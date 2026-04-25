import { describe, expect, it } from 'vitest'
import {
  calculateComparison,
  calculateProductResult,
  calculateSavings,
  calculateUnitPrice,
  getBaseUnit,
  getEffectivePrice,
  getUnitGroup,
  isValidAmount,
  isValidPrice,
  isValidProduct,
  normalizeAmount,
} from './calculations'
import type { ProductInput } from '../types/unit-price'

const product = (overrides: Partial<ProductInput> = {}): ProductInput => ({
  id: 'product-1',
  name: '',
  price: 200,
  amount: 500,
  unit: 'gram',
  note: '',
  ...overrides,
})

describe('unit price calculations', () => {
  it('returns unit groups and base units', () => {
    expect(getUnitGroup('gram')).toBe('mass')
    expect(getUnitGroup('liter')).toBe('volume')
    expect(getUnitGroup('piece')).toBe('count')
    expect(getBaseUnit('gram')).toBe('kilogram')
    expect(getBaseUnit('milliliter')).toBe('liter')
    expect(getBaseUnit('piece')).toBe('piece')
  })

  it('normalizes package amounts', () => {
    expect(normalizeAmount(500, 'gram')).toBe(0.5)
    expect(normalizeAmount(750, 'milliliter')).toBe(0.75)
    expect(normalizeAmount(2, 'kilogram')).toBe(2)
    expect(normalizeAmount(4, 'piece')).toBe(4)
  })

  it('calculates mass unit price', () => {
    expect(calculateUnitPrice(200, 500, 'gram')).toBeCloseTo(400)
    expect(calculateUnitPrice(120, 0.9, 'kilogram')).toBeCloseTo(133.33, 2)
  })

  it('calculates volume unit price', () => {
    expect(calculateUnitPrice(90, 1, 'liter')).toBeCloseTo(90)
    expect(calculateUnitPrice(60, 500, 'milliliter')).toBeCloseTo(120)
  })

  it('calculates piece unit price', () => {
    expect(calculateUnitPrice(300, 10, 'piece')).toBeCloseTo(30)
  })

  it('uses package price as effective price', () => {
    const input = product({ price: 250, amount: 500, unit: 'gram' })
    expect(getEffectivePrice(input)).toBe(250)
    expect(calculateProductResult(input)?.unitPrice).toBeCloseTo(500)
  })
})

describe('unit price comparison', () => {
  it('finds cheaper mass product', () => {
    const result = calculateComparison([
      product({ id: 'a', price: 200, amount: 500, unit: 'gram' }),
      product({ id: 'b', price: 350, amount: 1, unit: 'kilogram' }),
    ])
    expect(result.winner?.id).toBe('b')
    expect(result.savingsByProductId.a.savingsPerBaseUnit).toBeCloseTo(50)
    expect(result.savingsByProductId.a.savingsPercent).toBeCloseTo(12.5)
  })

  it('finds cheaper volume product', () => {
    const result = calculateComparison([
      product({ id: 'a', price: 60, amount: 500, unit: 'milliliter' }),
      product({ id: 'b', price: 100, amount: 1, unit: 'liter' }),
    ])
    expect(result.winner?.id).toBe('b')
  })

  it('finds cheaper piece product', () => {
    const result = calculateComparison([
      product({ id: 'a', price: 300, amount: 10, unit: 'piece' }),
      product({ id: 'b', price: 250, amount: 8, unit: 'piece' }),
    ])
    expect(result.winner?.id).toBe('a')
  })

  it('does not choose a winner for mixed unit groups', () => {
    const result = calculateComparison([
      product({ id: 'a', price: 200, amount: 500, unit: 'gram' }),
      product({ id: 'b', price: 100, amount: 1, unit: 'liter' }),
    ])
    expect(result.hasMixedGroups).toBe(true)
    expect(result.canCompare).toBe(false)
    expect(result.winner).toBeNull()
  })

  it('does not choose a winner when only one product is valid', () => {
    const result = calculateComparison([
      product({ id: 'a', price: 200, amount: 500, unit: 'gram' }),
      product({ id: 'b', price: -1, amount: 1, unit: 'kilogram' }),
    ])
    expect(result.results).toHaveLength(1)
    expect(result.winner).toBeNull()
    expect(result.results[0].unitPrice).toBeCloseTo(400)
  })

  it('calculates savings against another unit price', () => {
    expect(calculateSavings(350, 400)).toEqual({
      savingsPerBaseUnit: 50,
      savingsPercent: 12.5,
    })
  })
})

describe('unit price validation', () => {
  it('rejects amount = 0', () => {
    expect(isValidAmount(0)).toBe(false)
    expect(isValidProduct(product({ amount: 0 }))).toBe(false)
  })

  it('rejects negative price', () => {
    expect(isValidPrice(-1)).toBe(false)
    expect(isValidProduct(product({ price: -1 }))).toBe(false)
  })

  it('rejects NaN and Infinity', () => {
    expect(isValidPrice(Number.NaN)).toBe(false)
    expect(isValidPrice(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isValidAmount(Number.NaN)).toBe(false)
    expect(isValidAmount(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isValidProduct(product({ price: Number.NaN }))).toBe(false)
    expect(isValidProduct(product({ amount: Number.POSITIVE_INFINITY }))).toBe(false)
  })

  it('does not break calculations with an empty product', () => {
    const result = calculateComparison([
      product({ id: 'a', price: '', amount: '' }),
      product({ id: 'b', price: 200, amount: 500, unit: 'gram' }),
    ])
    expect(result.results).toHaveLength(1)
    expect(result.winner).toBeNull()
    expect(result.results[0].unitPrice).toBeCloseTo(400)
  })
})
