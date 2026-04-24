export function roundPercentageResult(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calculatePercentOf(percent: number, base: number): number | null {
  if (!Number.isFinite(percent) || !Number.isFinite(base)) return null
  return roundPercentageResult(base * percent / 100)
}

export function calculatePartOfTotal(part: number, total: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total === 0) return null
  return roundPercentageResult(part / total * 100)
}

export function adjustByPercent(base: number, percent: number, direction: 'increase' | 'decrease'): number | null {
  if (!Number.isFinite(base) || !Number.isFinite(percent)) return null

  const multiplier = direction === 'increase'
    ? 1 + percent / 100
    : 1 - percent / 100

  return roundPercentageResult(base * multiplier)
}

export function calculatePercentageChange(oldValue: number, newValue: number): number | null {
  if (!Number.isFinite(oldValue) || !Number.isFinite(newValue) || oldValue === 0) return null
  return roundPercentageResult((newValue - oldValue) / oldValue * 100)
}
