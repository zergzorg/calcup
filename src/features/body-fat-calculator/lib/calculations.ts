import type { BodyFatInput, BodyFatResult, BodyFatSex } from '../types/bodyFat'

const CM_PER_INCH = 2.54

export function roundTo(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function toInches(valueCm: number): number {
  return valueCm / CM_PER_INCH
}

export function calculateNavyBodyFatPercent(input: BodyFatInput): number | null {
  if (!Number.isFinite(input.heightCm) || input.heightCm <= 0) return null
  if (!Number.isFinite(input.neckCm) || input.neckCm <= 0) return null
  if (!Number.isFinite(input.waistCm) || input.waistCm <= 0) return null

  const height = toInches(input.heightCm)
  const neck = toInches(input.neckCm)
  const waist = toInches(input.waistCm)

  if (input.sex === 'male') {
    const circumference = waist - neck
    if (circumference <= 0) return null

    return roundTo(86.010 * Math.log10(circumference) - 70.041 * Math.log10(height) + 36.76)
  }

  if (!Number.isFinite(input.hipCm) || input.hipCm <= 0) return null

  const hip = toInches(input.hipCm)
  const circumference = waist + hip - neck
  if (circumference <= 0) return null

  return roundTo(163.205 * Math.log10(circumference) - 97.684 * Math.log10(height) - 78.387)
}

export function getBodyFatCategory(sex: BodyFatSex, percent: number): string {
  if (sex === 'male') {
    if (percent < 2) return 'belowEssential'
    if (percent <= 5) return 'essential'
    if (percent <= 13) return 'athletes'
    if (percent <= 17) return 'fitness'
    if (percent <= 24) return 'average'
    return 'obese'
  }

  if (percent < 10) return 'belowEssential'
  if (percent <= 13) return 'essential'
  if (percent <= 20) return 'athletes'
  if (percent <= 24) return 'fitness'
  if (percent <= 31) return 'average'
  return 'obese'
}

export function calculateBodyFat(input: BodyFatInput, weightKg?: number): BodyFatResult | null {
  const bodyFatPercent = calculateNavyBodyFatPercent(input)
  if (bodyFatPercent === null || bodyFatPercent < 0 || bodyFatPercent > 80) return null

  const canCalculateMass = typeof weightKg === 'number' && Number.isFinite(weightKg) && weightKg > 0
  const fatMassKg = canCalculateMass ? roundTo(weightKg * bodyFatPercent / 100, 1) : null
  const leanMassKg = canCalculateMass && fatMassKg !== null ? roundTo(weightKg - fatMassKg, 1) : null

  return {
    sex: input.sex,
    bodyFatPercent,
    fatMassKg,
    leanMassKg,
    categoryKey: getBodyFatCategory(input.sex, bodyFatPercent),
  }
}
