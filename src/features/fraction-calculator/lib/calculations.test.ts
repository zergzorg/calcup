import { describe, expect, it } from 'vitest'
import { calculateFractions, greatestCommonDivisor, normalizeFraction } from './calculations'

describe('fraction calculations', () => {
  it('calculates the greatest common divisor', () => {
    expect(greatestCommonDivisor(24, 18)).toBe(6)
    expect(greatestCommonDivisor(-15, 10)).toBe(5)
  })

  it('normalizes fractions', () => {
    expect(normalizeFraction({ numerator: 4, denominator: 8 })).toEqual({ numerator: 1, denominator: 2 })
    expect(normalizeFraction({ numerator: 3, denominator: -9 })).toEqual({ numerator: -1, denominator: 3 })
    expect(normalizeFraction({ numerator: 0, denominator: 9 })).toEqual({ numerator: 0, denominator: 1 })
  })

  it('adds fractions', () => {
    expect(calculateFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
      'add',
    )?.fraction).toEqual({ numerator: 5, denominator: 6 })
  })

  it('subtracts fractions', () => {
    expect(calculateFractions(
      { numerator: 3, denominator: 4 },
      { numerator: 5, denominator: 6 },
      'subtract',
    )?.fraction).toEqual({ numerator: -1, denominator: 12 })
  })

  it('multiplies and divides fractions', () => {
    expect(calculateFractions(
      { numerator: 2, denominator: 3 },
      { numerator: 9, denominator: 10 },
      'multiply',
    )?.fraction).toEqual({ numerator: 3, denominator: 5 })

    expect(calculateFractions(
      { numerator: 2, denominator: 3 },
      { numerator: 4, denominator: 5 },
      'divide',
    )?.fraction).toEqual({ numerator: 5, denominator: 6 })
  })

  it('builds mixed fractions for improper results', () => {
    const result = calculateFractions(
      { numerator: 7, denominator: 4 },
      { numerator: 1, denominator: 2 },
      'add',
    )

    expect(result?.fraction).toEqual({ numerator: 9, denominator: 4 })
    expect(result?.mixed).toEqual({ sign: 1, whole: 2, numerator: 1, denominator: 4 })
  })

  it('rejects invalid fractions', () => {
    expect(normalizeFraction({ numerator: 1.5, denominator: 2 })).toBeNull()
    expect(calculateFractions(
      { numerator: 1, denominator: 0 },
      { numerator: 1, denominator: 2 },
      'add',
    )).toBeNull()
    expect(calculateFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 0, denominator: 3 },
      'divide',
    )).toBeNull()
  })
})
