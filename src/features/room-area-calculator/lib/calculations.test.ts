import { describe, expect, it } from 'vitest'
import { calculateRoomArea } from './calculations'
import type { RoomAreaInput } from '../types/room-area'

const baseInput: RoomAreaInput = {
  lengthM: 5,
  widthM: 4,
  heightM: 2.7,
  windowsCount: 2,
  windowWidthM: 1.2,
  windowHeightM: 1.4,
  doorsCount: 1,
  doorWidthM: 0.9,
  doorHeightM: 2,
  extraOpeningsAreaM2: 0,
}

describe('room area calculations', () => {
  it('calculates floor, perimeter and wall areas', () => {
    const result = calculateRoomArea(baseInput)

    expect(result?.floorAreaM2).toBe(20)
    expect(result?.ceilingAreaM2).toBe(20)
    expect(result?.perimeterM).toBe(18)
    expect(result?.grossWallAreaM2).toBeCloseTo(48.6, 10)
  })

  it('subtracts windows, doors and extra openings from wall area', () => {
    const result = calculateRoomArea({
      ...baseInput,
      extraOpeningsAreaM2: 0.5,
    })

    expect(result?.openingsAreaM2).toBeCloseTo(5.66, 10)
    expect(result?.finishWallAreaM2).toBeCloseTo(42.94, 10)
  })

  it('clamps finish wall area to zero when openings are larger than walls', () => {
    const result = calculateRoomArea({
      ...baseInput,
      extraOpeningsAreaM2: 100,
    })

    expect(result?.finishWallAreaM2).toBe(0)
  })

  it('rejects invalid dimensions and counts', () => {
    expect(calculateRoomArea({ ...baseInput, lengthM: 0 })).toBeNull()
    expect(calculateRoomArea({ ...baseInput, windowsCount: 1.5 })).toBeNull()
    expect(calculateRoomArea({ ...baseInput, extraOpeningsAreaM2: -1 })).toBeNull()
  })
})
