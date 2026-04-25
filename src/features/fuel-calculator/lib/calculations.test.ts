import { describe, expect, it } from 'vitest'
import {
  calcConsumptionPer100Km,
  calcRequiredFuel,
  calcTripCost,
  isValidNonNegative,
  isValidPositive,
} from './calculations'

describe('calcConsumptionPer100Km', () => {
  it('600 km and 48 L → 8 L/100km', () => {
    expect(calcConsumptionPer100Km(600, 48)).toBe(8)
  })

  it('distance = 0 is invalid', () => {
    expect(calcConsumptionPer100Km(0, 48)).toBeNull()
  })

  it('fuel = 0 is invalid', () => {
    expect(calcConsumptionPer100Km(600, 0)).toBeNull()
  })

  it('negative distance is invalid', () => {
    expect(calcConsumptionPer100Km(-100, 48)).toBeNull()
  })

  it('negative fuel is invalid', () => {
    expect(calcConsumptionPer100Km(600, -10)).toBeNull()
  })

  it('NaN is invalid', () => {
    expect(calcConsumptionPer100Km(Number.NaN, 48)).toBeNull()
  })

  it('Infinity is invalid', () => {
    expect(calcConsumptionPer100Km(600, Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('calcRequiredFuel', () => {
  it('250 km at 8 L/100km → 20 L', () => {
    expect(calcRequiredFuel(250, 8)).toBe(20)
  })

  it('distance = 0 is invalid', () => {
    expect(calcRequiredFuel(0, 8)).toBeNull()
  })

  it('consumption = 0 is invalid', () => {
    expect(calcRequiredFuel(250, 0)).toBeNull()
  })

  it('negative distance is invalid', () => {
    expect(calcRequiredFuel(-250, 8)).toBeNull()
  })

  it('NaN is invalid', () => {
    expect(calcRequiredFuel(Number.NaN, 8)).toBeNull()
  })

  it('Infinity is invalid', () => {
    expect(calcRequiredFuel(250, Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('calcTripCost', () => {
  it('250 km at 8 L/100km and 60 ₽/L → cost 1200, liters 20', () => {
    const result = calcTripCost(250, 8, 60)
    expect(result?.cost).toBe(1200)
    expect(result?.liters).toBe(20)
  })

  it('price = 0 is valid and returns cost 0', () => {
    const result = calcTripCost(250, 8, 0)
    expect(result?.cost).toBe(0)
    expect(result?.liters).toBe(20)
  })

  it('distance = 0 is invalid', () => {
    expect(calcTripCost(0, 8, 60)).toBeNull()
  })

  it('consumption = 0 is invalid', () => {
    expect(calcTripCost(250, 0, 60)).toBeNull()
  })

  it('negative price is invalid', () => {
    expect(calcTripCost(250, 8, -10)).toBeNull()
  })

  it('NaN distance is invalid', () => {
    expect(calcTripCost(Number.NaN, 8, 60)).toBeNull()
  })

  it('Infinity consumption is invalid', () => {
    expect(calcTripCost(250, Number.POSITIVE_INFINITY, 60)).toBeNull()
  })
})

describe('isValidPositive', () => {
  it('positive value is valid', () => {
    expect(isValidPositive(1)).toBe(true)
    expect(isValidPositive(0.1)).toBe(true)
  })

  it('zero is invalid', () => {
    expect(isValidPositive(0)).toBe(false)
  })

  it('negative is invalid', () => {
    expect(isValidPositive(-1)).toBe(false)
  })

  it('NaN is invalid', () => {
    expect(isValidPositive(Number.NaN)).toBe(false)
  })

  it('Infinity is invalid', () => {
    expect(isValidPositive(Number.POSITIVE_INFINITY)).toBe(false)
  })
})

describe('isValidNonNegative', () => {
  it('zero is valid', () => {
    expect(isValidNonNegative(0)).toBe(true)
  })

  it('positive is valid', () => {
    expect(isValidNonNegative(1)).toBe(true)
  })

  it('negative is invalid', () => {
    expect(isValidNonNegative(-1)).toBe(false)
  })

  it('NaN is invalid', () => {
    expect(isValidNonNegative(Number.NaN)).toBe(false)
  })
})
