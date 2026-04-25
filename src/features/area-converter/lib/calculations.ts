import type { AreaUnit, AreaUnitMeta } from '../types/area'

export const AREA_UNITS: AreaUnitMeta[] = [
  { unit: 'squareMillimeter', squareMeters: 0.000001 },
  { unit: 'squareCentimeter', squareMeters: 0.0001 },
  { unit: 'squareMeter', squareMeters: 1 },
  { unit: 'are', squareMeters: 100 },
  { unit: 'hectare', squareMeters: 10_000 },
  { unit: 'squareKilometer', squareMeters: 1_000_000 },
  { unit: 'squareInch', squareMeters: 0.00064516 },
  { unit: 'squareFoot', squareMeters: 0.09290304 },
  { unit: 'squareYard', squareMeters: 0.83612736 },
  { unit: 'acre', squareMeters: 4046.8564224 },
]

const SQ_METERS: Record<AreaUnit, number> = AREA_UNITS.reduce<Record<AreaUnit, number>>(
  (acc, item) => { acc[item.unit] = item.squareMeters; return acc },
  {} as Record<AreaUnit, number>,
)

export function isValidAreaValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function roundArea(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  if (value === 0) return 0

  // Keep up to 8 significant digits
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const factor = Math.pow(10, 8 - magnitude)
  return Math.round(value * factor) / factor
}

export function convertArea(value: number, fromUnit: AreaUnit, toUnit: AreaUnit): number | null {
  if (!isValidAreaValue(value)) return null
  if (fromUnit === toUnit) return value

  const fromSqM = SQ_METERS[fromUnit]
  const toSqM = SQ_METERS[toUnit]

  return roundArea(value * fromSqM / toSqM)
}
