import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { VolumeUnit } from '../types/volume'

export const VOLUME_UNITS = CONVERSION_UNITS_CONFIG.volume.units.map(item => item.unit as VolumeUnit)

export const LITERS_PER_UNIT = CONVERSION_UNITS_CONFIG.volume.units.reduce<Record<VolumeUnit, number>>((acc, item) => {
  acc[item.unit as VolumeUnit] = item.factor
  return acc
}, {} as Record<VolumeUnit, number>)

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null
  }

  const fromFactor = LITERS_PER_UNIT[from]
  const toFactor = LITERS_PER_UNIT[to]

  if (!fromFactor || !toFactor) {
    return null
  }

  return value * fromFactor / toFactor
}
