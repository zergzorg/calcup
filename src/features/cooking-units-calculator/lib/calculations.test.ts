import { describe, expect, it } from 'vitest'
import { convertCookingUnit } from './calculations'

describe('cooking units calculations', () => {
  it('converts tablespoons to milliliters', () => {
    expect(convertCookingUnit(2, 'tablespoon', 'milliliter')).toBe(30)
  })

  it('converts cups to tablespoons', () => {
    expect(convertCookingUnit(1, 'cup', 'tablespoon')).toBe(16)
  })

  it('converts liters to cups', () => {
    expect(convertCookingUnit(1, 'liter', 'cup')).toBeCloseTo(4.1666666667, 10)
  })

  it('converts US fluid ounces to milliliters', () => {
    expect(convertCookingUnit(1, 'fluidOunce', 'milliliter')).toBeCloseTo(29.5735295625, 10)
  })

  it('rejects invalid values', () => {
    expect(convertCookingUnit(-1, 'cup', 'milliliter')).toBeNull()
    expect(convertCookingUnit(Number.NaN, 'cup', 'milliliter')).toBeNull()
  })
})
