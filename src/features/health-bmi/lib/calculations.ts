import type { BmiCategory, BmiResult } from '../types/bmi'

export function roundBmi(value: number): number {
  return Math.round(value * 10) / 10
}

export function calculateBmi(weightKg: number, heightCm: number): number | null {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return null
  if (weightKg <= 0 || heightCm <= 0) return null

  const heightM = heightCm / 100
  return roundBmi(weightKg / (heightM * heightM))
}

export function getBmiCategory(bmi: number): BmiCategory | null {
  if (!Number.isFinite(bmi) || bmi <= 0) return null
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obesity'
}

export function calculateBmiResult(weightKg: number, heightCm: number): BmiResult | null {
  const value = calculateBmi(weightKg, heightCm)
  if (value === null) return null

  const category = getBmiCategory(value)
  if (category === null) return null

  return { value, category }
}
