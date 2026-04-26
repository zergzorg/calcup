import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { CookingUnit } from '../types/cooking-units'

export const COOKING_UNITS = CONVERSION_UNITS_CONFIG.cooking.units.map(item => item.unit as CookingUnit)

export const MILLILITERS_PER_COOKING_UNIT = CONVERSION_UNITS_CONFIG.cooking.units.reduce<Record<CookingUnit, number>>((acc, item) => {
  acc[item.unit as CookingUnit] = item.factor
  return acc
}, {} as Record<CookingUnit, number>)

export function convertCookingUnit(value: number, from: CookingUnit, to: CookingUnit): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null
  }

  const fromFactor = MILLILITERS_PER_COOKING_UNIT[from]
  const toFactor = MILLILITERS_PER_COOKING_UNIT[to]

  if (!fromFactor || !toFactor) {
    return null
  }

  return value * fromFactor / toFactor
}
