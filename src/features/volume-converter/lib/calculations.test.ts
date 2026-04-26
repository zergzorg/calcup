import { describe, expect, it } from 'vitest'
import { convertVolume } from './calculations'

describe('volume converter calculations', () => {
  it('converts liters to milliliters', () => {
    expect(convertVolume(2.5, 'liter', 'milliliter')).toBe(2500)
  })

  it('converts cubic meters to liters', () => {
    expect(convertVolume(0.75, 'cubicMeter', 'liter')).toBe(750)
  })

  it('converts US gallons to liters', () => {
    expect(convertVolume(1, 'gallon', 'liter')).toBeCloseTo(3.785411784, 10)
  })

  it('converts cups to tablespoons', () => {
    expect(convertVolume(1, 'cup', 'tablespoon')).toBeCloseTo(16, 10)
  })

  it('rejects invalid values', () => {
    expect(convertVolume(-1, 'liter', 'cup')).toBeNull()
    expect(convertVolume(Number.NaN, 'liter', 'cup')).toBeNull()
  })
})
