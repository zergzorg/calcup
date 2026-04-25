import type { ShoeSizeConversionResult, ShoeSizeSystem, ShoeSizeSystemMeta } from '../types/shoe-size'

const CM_PER_INCH = 2.54
const LAST_ALLOWANCE_CM = 1.5
const BARLEYCORN_ALLOWANCE_IN = 2 / 3

export const SHOE_SIZE_SYSTEMS: ShoeSizeSystemMeta[] = [
  { system: 'cm' },
  { system: 'mondopoint' },
  { system: 'eu' },
  { system: 'uk' },
  { system: 'usMen' },
  { system: 'usWomen' },
]

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

function roundToHalf(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  return Math.round((value + Number.EPSILON) * 2) / 2
}

export function isValidShoeSizeInput(value: number, system: ShoeSizeSystem): boolean {
  if (!Number.isFinite(value) || value <= 0) return false

  switch (system) {
    case 'cm':
      return value >= 8 && value <= 35
    case 'mondopoint':
      return value >= 80 && value <= 350
    case 'eu':
      return value >= 16 && value <= 55
    case 'uk':
      return value >= 0 && value <= 16
    case 'usMen':
      return value >= 1 && value <= 18
    case 'usWomen':
      return value >= 2 && value <= 19
    default:
      return false
  }
}

export function footLengthFromSystem(value: number, system: ShoeSizeSystem): number | null {
  if (!isValidShoeSizeInput(value, system)) return null

  switch (system) {
    case 'cm':
      return roundTo(value, 2)
    case 'mondopoint':
      return roundTo(value / 10, 2)
    case 'eu':
      return roundTo(value / 1.5 - LAST_ALLOWANCE_CM, 2)
    case 'uk':
      return roundTo(((value + 25) / 3 - BARLEYCORN_ALLOWANCE_IN) * CM_PER_INCH, 2)
    case 'usMen':
      return footLengthFromSystem(value - 1, 'uk')
    case 'usWomen':
      return footLengthFromSystem(value - 2, 'uk')
    default:
      return null
  }
}

export function convertShoeSize(value: number, system: ShoeSizeSystem): ShoeSizeConversionResult | null {
  const footLengthCm = footLengthFromSystem(value, system)
  if (footLengthCm === null) return null

  const footLengthIn = footLengthCm / CM_PER_INCH
  const eu = (footLengthCm + LAST_ALLOWANCE_CM) * 1.5
  const uk = 3 * (footLengthIn + BARLEYCORN_ALLOWANCE_IN) - 25
  const usMen = uk + 1
  const usWomen = uk + 2

  return {
    footLengthCm: roundTo(footLengthCm, 2),
    mondopointMm: Math.round(footLengthCm * 10),
    eu: roundToHalf(eu),
    ru: roundToHalf(eu),
    uk: roundToHalf(uk),
    usMen: roundToHalf(usMen),
    usWomen: roundToHalf(usWomen),
    footLengthIn: roundTo(footLengthIn, 2),
  }
}
