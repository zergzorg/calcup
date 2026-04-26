import { describe, expect, it } from 'vitest'
import { getClothingSizeOptions, resolveClothingSize } from './calculations'

describe('clothing size converter', () => {
  it('returns the matching row by size key', () => {
    expect(resolveClothingSize('m')).toMatchObject({
      international: 'M',
      ru: '46-48',
      eu: '40-42',
      us: '8-10',
      uk: '12-14',
    })
  })

  it('builds options for a selected sizing system', () => {
    expect(getClothingSizeOptions('ru')).toEqual([
      { key: 'xs', label: '40-42' },
      { key: 's', label: '42-44' },
      { key: 'm', label: '46-48' },
      { key: 'l', label: '50-52' },
      { key: 'xl', label: '54-56' },
      { key: 'xxl', label: '58-60' },
    ])
  })

  it('returns null for an unknown size key at runtime', () => {
    expect(resolveClothingSize('unknown' as never)).toBeNull()
  })
})
