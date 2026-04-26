import { describe, expect, it } from 'vitest'
import {
  combinatorics,
  decimalToFraction,
  gcdLcm,
  geometryArea,
  primeNumber,
  pythagorean,
  quadraticEquation,
  solidVolume,
  statistics,
  triangleBySides,
} from './calculations'

describe('math education calculators', () => {
  it('calculates geometry and solid measures', () => {
    expect(geometryArea('rectangle', { a: 3, b: 4 })?.primary.value).toBe('12')
    expect(solidVolume('box', { a: 2, b: 3, c: 4 })?.primary.value).toBe('24')
  })

  it('solves pythagorean and triangle tasks', () => {
    expect(pythagorean('c', { a: 3, b: 4, c: 0 })?.primary.value).toBe('5')
    expect(triangleBySides(3, 4, 5)?.rows.find(row => row.key === 'perimeter')?.value).toBe('12')
  })

  it('solves quadratic equations with steps', () => {
    const result = quadraticEquation(1, -5, 6)
    expect(result?.primary.value).toBe('2; 3')
    expect(result?.steps).toHaveLength(3)
  })

  it('calculates number theory helpers', () => {
    expect(gcdLcm([12, 18])?.primary.value).toBe('6')
    expect(gcdLcm([12, 18])?.rows[0].value).toBe('36')
    expect(primeNumber(84)?.rows[0].value).toBe('2 × 2 × 3 × 7')
    expect(primeNumber(97)?.primary.value).toBe('да')
  })

  it('converts decimals and calculates statistics', () => {
    expect(decimalToFraction('1.25')?.primary.value).toBe('5/4')
    expect(statistics([1, 2, 3, 4])?.rows.find(row => row.key === 'variance')?.value).toBe('1.25')
  })

  it('calculates combinatorics values', () => {
    const result = combinatorics(5, 2)
    expect(result?.primary.value).toBe('10')
    expect(result?.rows.find(row => row.key === 'arrangements')?.value).toBe('20')
  })
})
