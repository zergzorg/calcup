import type { LengthUnit, LengthUnitMeta } from '../types/length'

export const LENGTH_UNITS: LengthUnitMeta[] = [
  { unit: 'millimeter', meters: 0.001 },
  { unit: 'centimeter', meters: 0.01 },
  { unit: 'meter', meters: 1 },
  { unit: 'kilometer', meters: 1000 },
  { unit: 'inch', meters: 0.0254 },
  { unit: 'foot', meters: 0.3048 },
  { unit: 'yard', meters: 0.9144 },
  { unit: 'mile', meters: 1609.344 },
]

const METERS_BY_UNIT = LENGTH_UNITS.reduce<Record<LengthUnit, number>>((acc, item) => {
  acc[item.unit] = item.meters
  return acc
}, {} as Record<LengthUnit, number>)

export function isValidLengthValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function roundLength(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000
}

export function convertLength(value: number, fromUnit: LengthUnit, toUnit: LengthUnit): number | null {
  if (!isValidLengthValue(value)) return null

  const fromMeters = METERS_BY_UNIT[fromUnit]
  const toMeters = METERS_BY_UNIT[toUnit]
  if (!fromMeters || !toMeters) return null

  if (fromUnit === toUnit) return value

  return roundLength(value * fromMeters / toMeters)
}
