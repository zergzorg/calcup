import { describe, expect, it } from 'vitest'
import { convertShoeSize, footLengthFromSystem, isValidShoeSizeInput } from './calculations'

describe('shoe size conversion calculations', () => {
  it('converts foot length in centimeters to major adult systems', () => {
    expect(convertShoeSize(26.5, 'cm')).toEqual({
      footLengthCm: 26.5,
      mondopointMm: 265,
      eu: 42,
      ru: 42,
      uk: 8.5,
      usMen: 9.5,
      usWomen: 10.5,
      footLengthIn: 10.43,
    })
  })

  it('treats Mondopoint as millimeters of foot length', () => {
    expect(footLengthFromSystem(270, 'mondopoint')).toBe(27)
    expect(convertShoeSize(270, 'mondopoint')?.mondopointMm).toBe(270)
  })

  it('converts EU/RU size back to foot length with allowance', () => {
    expect(footLengthFromSystem(42, 'eu')).toBe(26.5)
    expect(convertShoeSize(42, 'eu')?.usMen).toBe(9.5)
  })

  it('converts UK and US adult sizes through the same foot length baseline', () => {
    expect(footLengthFromSystem(8.5, 'uk')).toBe(26.67)
    expect(convertShoeSize(9.5, 'usMen')?.uk).toBe(8.5)
    expect(convertShoeSize(10.5, 'usWomen')?.usMen).toBe(9.5)
  })

  it('rejects empty, negative and unrealistic input values', () => {
    expect(isValidShoeSizeInput(0, 'cm')).toBe(false)
    expect(isValidShoeSizeInput(-1, 'eu')).toBe(false)
    expect(isValidShoeSizeInput(Number.NaN, 'uk')).toBe(false)
    expect(isValidShoeSizeInput(4, 'cm')).toBe(false)
    expect(isValidShoeSizeInput(80, 'eu')).toBe(false)
    expect(convertShoeSize(0, 'cm')).toBeNull()
  })
})
