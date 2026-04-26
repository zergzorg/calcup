import { describe, expect, it } from 'vitest'
import { calculateAverageStats, parseNumberList } from './calculations'

describe('average calculations', () => {
  it('parses whitespace, semicolon and comma separated numbers', () => {
    expect(parseNumberList('10 12\n14; 16, 18').values).toEqual([10, 12, 14, 16, 18])
  })

  it('parses decimal commas', () => {
    expect(parseNumberList('1,5 2,5 3').values).toEqual([1.5, 2.5, 3])
  })

  it('returns invalid tokens', () => {
    expect(parseNumberList('1 apple 3').invalidTokens).toEqual(['apple'])
  })

  it('calculates mean, median and range for odd lists', () => {
    const stats = calculateAverageStats([10, 2, 4])

    expect(stats?.count).toBe(3)
    expect(stats?.sum).toBe(16)
    expect(stats?.mean).toBeCloseTo(5.3333333333, 10)
    expect(stats?.median).toBe(4)
    expect(stats?.min).toBe(2)
    expect(stats?.max).toBe(10)
    expect(stats?.range).toBe(8)
  })

  it('calculates median for even lists', () => {
    expect(calculateAverageStats([10, 2, 4, 8])?.median).toBe(6)
  })

  it('rejects empty or invalid lists', () => {
    expect(calculateAverageStats([])).toBeNull()
    expect(calculateAverageStats([1, Number.NaN])).toBeNull()
  })
})
