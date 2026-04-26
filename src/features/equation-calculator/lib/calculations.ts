import type { LinearEquationResult, QuadraticEquationResult } from '../types/equation'

const EPSILON = 1e-12

function isZero(value: number): boolean {
  return Math.abs(value) < EPSILON
}

export function solveLinearEquation(a: number, b: number): LinearEquationResult | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null
  }

  if (isZero(a) && isZero(b)) {
    return { type: 'infinite', root: null }
  }

  if (isZero(a)) {
    return { type: 'none', root: null }
  }

  return {
    type: 'one',
    root: -b / a,
  }
}

export function solveQuadraticEquation(a: number, b: number, c: number): QuadraticEquationResult | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return null
  }

  if (isZero(a)) {
    const linear = solveLinearEquation(b, c)

    if (!linear) {
      return null
    }

    return {
      type: 'linear',
      discriminant: Number.NaN,
      roots: linear.root === null ? [] : [linear.root],
    }
  }

  const discriminant = b ** 2 - 4 * a * c

  if (discriminant < -EPSILON) {
    return {
      type: 'none',
      discriminant,
      roots: [],
    }
  }

  if (isZero(discriminant)) {
    return {
      type: 'one',
      discriminant: 0,
      roots: [-b / (2 * a)],
    }
  }

  const sqrtDiscriminant = Math.sqrt(discriminant)

  return {
    type: 'two',
    discriminant,
    roots: [
      (-b - sqrtDiscriminant) / (2 * a),
      (-b + sqrtDiscriminant) / (2 * a),
    ],
  }
}
