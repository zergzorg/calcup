import { describe, expect, it } from 'vitest'
import { convertDataSize, getDataSizeUnits } from './calculations'

describe('data size converter calculations', () => {
  it('converts decimal megabytes to bytes', () => {
    expect(convertDataSize(2.5, 'megabyte', 'byte')).toBe(2_500_000)
  })

  it('converts decimal gigabytes to megabytes', () => {
    expect(convertDataSize(1.25, 'gigabyte', 'megabyte')).toBe(1250)
  })

  it('converts binary gibibytes to mebibytes', () => {
    expect(convertDataSize(1.5, 'gibibyte', 'mebibyte')).toBe(1536)
  })

  it('shows the decimal and binary difference', () => {
    expect(convertDataSize(1, 'gigabyte', 'gibibyte')).toBeCloseTo(0.9313225746, 10)
  })

  it('returns units for the selected mode', () => {
    expect(getDataSizeUnits('decimal')).toEqual(['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'])
    expect(getDataSizeUnits('binary')).toEqual(['byte', 'kibibyte', 'mebibyte', 'gibibyte', 'tebibyte'])
  })

  it('rejects invalid values', () => {
    expect(convertDataSize(-1, 'megabyte', 'byte')).toBeNull()
    expect(convertDataSize(Number.NaN, 'megabyte', 'byte')).toBeNull()
  })
})
