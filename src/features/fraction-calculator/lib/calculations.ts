import type { FractionCalculationResult, FractionOperator, FractionValue, MixedFraction } from '../types/fraction'

export function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left)
  let b = Math.abs(right)

  while (b !== 0) {
    const next = a % b
    a = b
    b = next
  }

  return a || 1
}

export function normalizeFraction(fraction: FractionValue): FractionValue | null {
  const { numerator, denominator } = fraction

  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
    return null
  }

  if (numerator === 0) {
    return { numerator: 0, denominator: 1 }
  }

  const sign = denominator < 0 ? -1 : 1
  const gcd = greatestCommonDivisor(numerator, denominator)

  return {
    numerator: numerator / gcd * sign,
    denominator: Math.abs(denominator / gcd),
  }
}

export function calculateFractions(
  left: FractionValue,
  right: FractionValue,
  operator: FractionOperator,
): FractionCalculationResult | null {
  const normalizedLeft = normalizeFraction(left)
  const normalizedRight = normalizeFraction(right)

  if (!normalizedLeft || !normalizedRight) {
    return null
  }

  if (operator === 'divide' && normalizedRight.numerator === 0) {
    return null
  }

  const raw = calculateRawFraction(normalizedLeft, normalizedRight, operator)
  const fraction = normalizeFraction(raw)

  if (!fraction) {
    return null
  }

  return {
    fraction,
    decimal: fraction.numerator / fraction.denominator,
    mixed: toMixedFraction(fraction),
  }
}

function calculateRawFraction(left: FractionValue, right: FractionValue, operator: FractionOperator): FractionValue {
  if (operator === 'add') {
    return {
      numerator: left.numerator * right.denominator + right.numerator * left.denominator,
      denominator: left.denominator * right.denominator,
    }
  }

  if (operator === 'subtract') {
    return {
      numerator: left.numerator * right.denominator - right.numerator * left.denominator,
      denominator: left.denominator * right.denominator,
    }
  }

  if (operator === 'multiply') {
    return {
      numerator: left.numerator * right.numerator,
      denominator: left.denominator * right.denominator,
    }
  }

  return {
    numerator: left.numerator * right.denominator,
    denominator: left.denominator * right.numerator,
  }
}

function toMixedFraction(fraction: FractionValue): MixedFraction | null {
  const absNumerator = Math.abs(fraction.numerator)

  if (fraction.denominator === 1 || absNumerator < fraction.denominator) {
    return null
  }

  const whole = Math.trunc(absNumerator / fraction.denominator)
  const numerator = absNumerator % fraction.denominator

  return {
    sign: fraction.numerator < 0 ? -1 : 1,
    whole,
    numerator,
    denominator: fraction.denominator,
  }
}
