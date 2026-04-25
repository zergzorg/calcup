import { describe, expect, it } from 'vitest'
import { calculateBlocks } from './calculations'

describe('blocks calculations', () => {
  it('calculates blocks, wall volume, adhesive and cost', () => {
    expect(calculateBlocks({
      wallLength: 8,
      wallHeight: 3,
      openingsArea: 3,
      blockLengthMm: 600,
      blockHeightMm: 250,
      blockWidthMm: 300,
      wastePercent: 5,
      adhesiveKgPerM2: 5,
      bagWeightKg: 25,
      blockPrice: 180,
    })).toEqual({
      grossArea: 24,
      netArea: 21,
      blockFaceArea: 0.15,
      blockVolume: 0.045,
      wallVolume: 6.3,
      baseBlocks: 140,
      blocksWithWaste: 147,
      adhesiveKg: 105,
      adhesiveBags: 5,
      totalCost: 26460,
    })
  })

  it('allows zero adhesive and free block price', () => {
    expect(calculateBlocks({
      wallLength: 3,
      wallHeight: 2.5,
      openingsArea: 0,
      blockLengthMm: 600,
      blockHeightMm: 200,
      blockWidthMm: 200,
      wastePercent: 0,
      adhesiveKgPerM2: 0,
      bagWeightKg: 25,
      blockPrice: 0,
    })).toMatchObject({
      baseBlocks: 63,
      blocksWithWaste: 63,
      adhesiveKg: 0,
      adhesiveBags: 0,
      totalCost: null,
    })
  })

  it('rejects invalid values', () => {
    expect(calculateBlocks({
      wallLength: 2,
      wallHeight: 2,
      openingsArea: 4,
      blockLengthMm: 600,
      blockHeightMm: 250,
      blockWidthMm: 300,
      wastePercent: 5,
      adhesiveKgPerM2: 5,
      bagWeightKg: 25,
      blockPrice: 180,
    })).toBeNull()
  })
})
