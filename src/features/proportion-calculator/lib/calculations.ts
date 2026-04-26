import type { ProportionResult, RatioValue } from '../types/proportion'

export function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(Math.trunc(left))
  let b = Math.abs(Math.trunc(right))

  while (b !== 0) {
    const next = a % b
    a = b
    b = next
  }

  return a || 1
}

export function simplifyIntegerRatio(left: number, right: number): RatioValue | null {
  if (!Number.isInteger(left) || !Number.isInteger(right) || left === 0 || right === 0) {
    return null
  }

  const gcd = greatestCommonDivisor(left, right)

  return {
    left: left / gcd,
    right: right / gcd,
  }
}

export function calculateProportion(knownLeft: number, knownRight: number, targetLeft: number): ProportionResult | null {
  if (
    !Number.isFinite(knownLeft)
    || !Number.isFinite(knownRight)
    || !Number.isFinite(targetLeft)
    || knownLeft === 0
  ) {
    return null
  }

  const coefficient = knownRight / knownLeft
  const ratio = simplifyIntegerRatio(knownLeft, knownRight) ?? { left: knownLeft, right: knownRight }

  return {
    targetRight: targetLeft * coefficient,
    coefficient,
    ratio,
    targetPercentOfKnown: targetLeft / knownLeft * 100,
  }
}
