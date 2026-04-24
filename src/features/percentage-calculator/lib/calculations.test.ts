import { describe, expect, it } from 'vitest'
import {
  adjustByPercent,
  calculatePartOfTotal,
  calculatePercentageChange,
  calculatePercentOf,
} from './calculations'

describe('percentage calculations', () => {
  it('calculates X percent of a number', () => {
    expect(calculatePercentOf(15, 200)).toBe(30)
    expect(calculatePercentOf(12.5, 80)).toBe(10)
  })

  it('calculates what percent A is of B', () => {
    expect(calculatePartOfTotal(25, 200)).toBe(12.5)
    expect(calculatePartOfTotal(1, 3)).toBe(33.33)
  })

  it('increases and decreases a number by a percent', () => {
    expect(adjustByPercent(120, 10, 'increase')).toBe(132)
    expect(adjustByPercent(120, 10, 'decrease')).toBe(108)
  })

  it('calculates percentage change from an old value to a new value', () => {
    expect(calculatePercentageChange(80, 100)).toBe(25)
    expect(calculatePercentageChange(100, 80)).toBe(-20)
  })

  it('guards invalid inputs', () => {
    expect(calculatePercentOf(Number.NaN, 100)).toBeNull()
    expect(calculatePartOfTotal(10, 0)).toBeNull()
    expect(adjustByPercent(100, Number.NaN, 'increase')).toBeNull()
    expect(calculatePercentageChange(0, 100)).toBeNull()
  })
})
