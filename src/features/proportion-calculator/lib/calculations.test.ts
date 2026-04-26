import { describe, expect, it } from 'vitest'
import { calculateProportion, greatestCommonDivisor, simplifyIntegerRatio } from './calculations'

describe('proportion calculations', () => {
  it('calculates greatest common divisor', () => {
    expect(greatestCommonDivisor(36, 24)).toBe(12)
    expect(greatestCommonDivisor(-20, 15)).toBe(5)
  })

  it('simplifies integer ratios', () => {
    expect(simplifyIntegerRatio(12, 18)).toEqual({ left: 2, right: 3 })
    expect(simplifyIntegerRatio(5, 20)).toEqual({ left: 1, right: 4 })
  })

  it('solves direct proportion by the rule of three', () => {
    const result = calculateProportion(5, 20, 8)

    expect(result?.targetRight).toBe(32)
    expect(result?.coefficient).toBe(4)
    expect(result?.ratio).toEqual({ left: 1, right: 4 })
    expect(result?.targetPercentOfKnown).toBe(160)
  })

  it('supports decimal values', () => {
    expect(calculateProportion(2.5, 10, 4)?.targetRight).toBe(16)
  })

  it('rejects invalid values', () => {
    expect(calculateProportion(0, 10, 5)).toBeNull()
    expect(calculateProportion(Number.NaN, 10, 5)).toBeNull()
    expect(simplifyIntegerRatio(1.5, 3)).toBeNull()
  })
})
