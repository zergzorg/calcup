import type { WeightUnit } from '../types/weight'

const TO_KG: Record<WeightUnit, number> = {
  milligram: 0.000001,
  gram: 0.001,
  kilogram: 1,
  ton: 1000,
  ounce: 0.028349523125,
  pound: 0.45359237,
  stone: 6.35029318,
}

function toKilogram(value: number, unit: WeightUnit): number {
  return value * TO_KG[unit]
}

function fromKilogram(kg: number, unit: WeightUnit): number {
  return kg / TO_KG[unit]
}

export function convertWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) {
    return value
  }
  const kg = toKilogram(value, fromUnit)
  return fromKilogram(kg, toUnit)
}

export function formatWeight(value: number): string {
  if (!isFinite(value)) {
    return '—'
  }
  if (value === 0) {
    return '0'
  }
  if (value < 0.0001) {
    return value.toExponential(2)
  }
  const rounded = Math.round(value * 100000) / 100000
  if (rounded === 0) {
    return '< 0.00001'
  }
  if (Number.isInteger(rounded)) {
    return rounded.toString()
  }
  const fixed = rounded.toFixed(6).replace(/\.?0+$/, '')
  return fixed
}

export function isValidWeightValue(value: number): boolean {
  if (!Number.isFinite(value)) {
    return false
  }
  return value >= 0
}

export function getFormula(fromUnit: WeightUnit, toUnit: WeightUnit): string {
  if (fromUnit === toUnit) {
    return ''
  }
  const formulas: Record<string, string> = {
    'kilogram-gram': 'г = кг × 1000',
    'gram-kilogram': 'кг = г / 1000',
    'kilogram-ton': 'т = кг / 1000',
    'ton-kilogram': 'кг = т × 1000',
    'kilogram-pound': 'фунт = кг × 2.20462',
    'pound-kilogram': 'кг = фунт / 2.20462',
    'kilogram-ounce': 'унция = кг × 35.274',
    'ounce-gram': 'г = унция × 28.3495',
    'pound-ounce': 'унция = фунт × 16',
    'stone-pound': 'фунт = стоун × 14',
  }
  return formulas[`${fromUnit}-${toUnit}`] || ''
}