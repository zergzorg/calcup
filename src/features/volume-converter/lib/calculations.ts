import type { VolumeUnit } from '../types/volume'

export const VOLUME_UNITS: VolumeUnit[] = [
  'milliliter',
  'liter',
  'cubicMeter',
  'cubicCentimeter',
  'gallon',
  'quart',
  'pint',
  'cup',
  'tablespoon',
  'teaspoon',
]

export const LITERS_PER_UNIT: Record<VolumeUnit, number> = {
  milliliter: 0.001,
  liter: 1,
  cubicMeter: 1000,
  cubicCentimeter: 0.001,
  gallon: 3.785411784,
  quart: 0.946352946,
  pint: 0.473176473,
  cup: 0.2365882365,
  tablespoon: 0.01478676478125,
  teaspoon: 0.00492892159375,
}

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
