import type { AverageStats, NumberListParseResult } from '../types/average'

export function parseNumberList(input: string): NumberListParseResult {
  const normalized = input
    .trim()
    .replace(/,\s+/g, ' ')

  if (!normalized) {
    return { values: [], invalidTokens: [] }
  }

  const tokens = normalized.split(/[\s;]+/).filter(Boolean)
  const values: number[] = []
  const invalidTokens: string[] = []

  tokens.forEach((token) => {
    const value = Number(token.replace(',', '.'))

    if (Number.isFinite(value)) {
      values.push(value)
    } else {
      invalidTokens.push(token)
    }
  })

  return { values, invalidTokens }
}

export function calculateAverageStats(values: number[]): AverageStats | null {
  if (values.length === 0 || values.some(value => !Number.isFinite(value))) {
    return null
  }

  const sorted = [...values].sort((left, right) => left - right)
  const count = values.length
  const sum = values.reduce((total, value) => total + value, 0)
  const middleIndex = Math.floor(count / 2)
  const median = count % 2 === 0
    ? (sorted[middleIndex - 1] + sorted[middleIndex]) / 2
    : sorted[middleIndex]
  const min = sorted[0]
  const max = sorted[count - 1]

  return {
    values,
    count,
    sum,
    mean: sum / count,
    median,
    min,
    max,
    range: max - min,
  }
}
