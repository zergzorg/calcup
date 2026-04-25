import { describe, expect, it } from 'vitest'
import { calculateBrick, isNonNegative, isPositive } from './calculations'

describe('brick calculations', () => {
  it('calculates bricks, masonry volume and mortar volume', () => {
    expect(calculateBrick({
      wallLength: 10,
      wallHeight: 3,
      openingsArea: 4,
      brickLengthMm: 250,
      brickWidthMm: 120,
      brickHeightMm: 65,
      jointMm: 10,
      thicknessBricks: 0.5,
      wastePercent: 5,
      mortarSharePercent: 25,
      brickPrice: 18,
    })).toEqual({
      grossArea: 30,
      netArea: 26,
      bricksPerM2HalfBrick: 51.3,
      baseBricks: 667,
      bricksWithWaste: 701,
      masonryVolume: 3.12,
      mortarVolume: 0.78,
      totalCost: 12618,
    })
  })

  it('scales brick count by wall thickness', () => {
    const half = calculateBrick({
      wallLength: 5,
      wallHeight: 2,
      openingsArea: 0,
      brickLengthMm: 250,
      brickWidthMm: 120,
      brickHeightMm: 65,
      jointMm: 10,
      thicknessBricks: 0.5,
      wastePercent: 0,
      mortarSharePercent: 25,
      brickPrice: 0,
    })
    const one = calculateBrick({
      wallLength: 5,
      wallHeight: 2,
      openingsArea: 0,
      brickLengthMm: 250,
      brickWidthMm: 120,
      brickHeightMm: 65,
      jointMm: 10,
      thicknessBricks: 1,
      wastePercent: 0,
      mortarSharePercent: 25,
      brickPrice: 0,
    })

    expect(half?.baseBricks).toBe(257)
    expect(one?.baseBricks).toBe(513)
    expect(one?.totalCost).toBeNull()
  })

  it('rejects invalid wall or opening values', () => {
    expect(calculateBrick({
      wallLength: 2,
      wallHeight: 2,
      openingsArea: 4,
      brickLengthMm: 250,
      brickWidthMm: 120,
      brickHeightMm: 65,
      jointMm: 10,
      thicknessBricks: 0.5,
      wastePercent: 0,
      mortarSharePercent: 25,
      brickPrice: 0,
    })).toBeNull()
    expect(isPositive(1)).toBe(true)
    expect(isNonNegative(-1)).toBe(false)
  })
})
