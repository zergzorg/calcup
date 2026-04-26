import { describe, expect, it } from 'vitest'
import { solveLinearEquation, solveQuadraticEquation } from './calculations'

describe('equation calculations', () => {
  it('solves a linear equation', () => {
    expect(solveLinearEquation(2, -8)).toEqual({ type: 'one', root: 4 })
  })

  it('handles degenerate linear equations', () => {
    expect(solveLinearEquation(0, 0)).toEqual({ type: 'infinite', root: null })
    expect(solveLinearEquation(0, 5)).toEqual({ type: 'none', root: null })
  })

  it('solves quadratic equations with two roots', () => {
    const result = solveQuadraticEquation(1, -5, 6)

    expect(result?.type).toBe('two')
    expect(result?.discriminant).toBe(1)
    expect(result?.roots).toEqual([2, 3])
  })

  it('solves quadratic equations with one root', () => {
    const result = solveQuadraticEquation(1, 2, 1)

    expect(result?.type).toBe('one')
    expect(result?.roots).toEqual([-1])
  })

  it('handles quadratic equations without real roots', () => {
    const result = solveQuadraticEquation(1, 0, 1)

    expect(result?.type).toBe('none')
    expect(result?.roots).toEqual([])
  })

  it('falls back to linear when a is zero', () => {
    expect(solveQuadraticEquation(0, 2, -8)?.roots).toEqual([4])
  })

  it('rejects invalid inputs', () => {
    expect(solveLinearEquation(Number.NaN, 1)).toBeNull()
    expect(solveQuadraticEquation(1, Number.NaN, 1)).toBeNull()
  })
})
