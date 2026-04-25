import { describe, expect, it } from 'vitest'
import { calculateTile, isNonNegative, isPositive } from './calculations'

describe('tile calculations', () => {
  it('calculates tiles, boxes and cost with waste', () => {
    expect(calculateTile({
      surfaceLength: 4,
      surfaceWidth: 3,
      tileLengthCm: 30,
      tileWidthCm: 30,
      wastePercent: 10,
      tilesPerBox: 11,
      boxPrice: 1200,
    })).toEqual({
      surfaceArea: 12,
      tileArea: 0.09,
      baseTiles: 134,
      tilesWithWaste: 148,
      boxesNeeded: 14,
      purchaseTiles: 154,
      leftoverTiles: 6,
      totalCost: 16800,
    })
  })

  it('allows zero waste and hidden cost', () => {
    const result = calculateTile({
      surfaceLength: 2,
      surfaceWidth: 2,
      tileLengthCm: 50,
      tileWidthCm: 50,
      wastePercent: 0,
      tilesPerBox: 4,
      boxPrice: 0,
    })

    expect(result?.baseTiles).toBe(16)
    expect(result?.boxesNeeded).toBe(4)
    expect(result?.totalCost).toBeNull()
  })

  it('rejects invalid input', () => {
    expect(calculateTile({
      surfaceLength: 0,
      surfaceWidth: 3,
      tileLengthCm: 30,
      tileWidthCm: 30,
      wastePercent: 10,
      tilesPerBox: 11,
      boxPrice: 1200,
    })).toBeNull()
    expect(isPositive(-1)).toBe(false)
    expect(isNonNegative(-1)).toBe(false)
  })
})
