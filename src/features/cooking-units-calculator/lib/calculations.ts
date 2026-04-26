import type { CookingUnit } from '../types/cooking-units'

export const COOKING_UNITS: CookingUnit[] = [
  'milliliter',
  'liter',
  'teaspoon',
  'tablespoon',
  'cup',
  'fluidOunce',
  'pint',
  'quart',
]

export const MILLILITERS_PER_COOKING_UNIT: Record<CookingUnit, number> = {
  milliliter: 1,
  liter: 1000,
  teaspoon: 5,
  tablespoon: 15,
  cup: 240,
  fluidOunce: 29.5735295625,
  pint: 473.176473,
  quart: 946.352946,
}

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
