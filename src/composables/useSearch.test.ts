import { describe, expect, it } from 'vitest'
import { searchCalculators, normalizeSearchText } from './useSearch'

function resultIds(query: string): string[] {
  return searchCalculators(query).map(calc => calc.id)
}

describe('calculator search', () => {
  it('normalizes common Russian spelling and unit variants', () => {
    expect(normalizeSearchText('Платёж')).toBe('платеж')
    expect(normalizeSearchText('м³')).toBe('м3')
    expect(normalizeSearchText('кВт·ч')).toBe('квт ч')
  })

  it('finds cat calculators by everyday cat words', () => {
    expect(resultIds('кот')).toEqual(expect.arrayContaining([
      'cat-age',
      'cat-calorie',
      'cat-pregnancy',
    ]))
    expect(resultIds('котенок')).toEqual(expect.arrayContaining([
      'cat-age',
      'cat-calorie',
      'cat-pregnancy',
    ]))
  })

  it('finds dog calculators by yo and puppy forms', () => {
    expect(resultIds('пёс')).toEqual(expect.arrayContaining([
      'dog-age',
      'dog-food',
      'dog-pregnancy',
    ]))
    expect(resultIds('щенок')).toEqual(expect.arrayContaining([
      'dog-age',
      'dog-food',
      'dog-pregnancy',
    ]))
  })

  it('finds calculators through descriptions and normalized typography', () => {
    expect(resultIds('платёж')).toContain('credit')
    expect(resultIds('счёт')).toEqual(expect.arrayContaining(['tips', 'bill-split']))
    expect(resultIds('м3')).toEqual(expect.arrayContaining(['volume', 'concrete']))
    expect(resultIds('квтч')).toContain('electricity')
    expect(resultIds('life stage')).toContain('cat-age')
  })
})
