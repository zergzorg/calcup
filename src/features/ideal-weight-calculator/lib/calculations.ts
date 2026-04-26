import type { IdealWeightFormula, IdealWeightFormulaResult, IdealWeightResult, IdealWeightSex } from '../types/ideal-weight'

const CM_PER_INCH = 2.54
const BASE_HEIGHT_INCHES = 60

const FORMULA_PARAMS: Record<IdealWeightFormula, Record<IdealWeightSex, { baseKg: number; perInchKg: number }>> = {
  devine: {
    male: { baseKg: 50, perInchKg: 2.3 },
    female: { baseKg: 45.5, perInchKg: 2.3 },
  },
  robinson: {
    male: { baseKg: 52, perInchKg: 1.9 },
    female: { baseKg: 49, perInchKg: 1.7 },
  },
  miller: {
    male: { baseKg: 56.2, perInchKg: 1.41 },
    female: { baseKg: 53.1, perInchKg: 1.36 },
  },
  hamwi: {
    male: { baseKg: 48, perInchKg: 2.7 },
    female: { baseKg: 45.5, perInchKg: 2.2 },
  },
}

export function roundWeight(value: number): number {
  return Math.round(value * 10) / 10
}

export function calculateFormulaWeight(sex: IdealWeightSex, heightCm: number, formula: IdealWeightFormula): number | null {
  if (!Number.isFinite(heightCm) || heightCm <= 0) return null

  const params = FORMULA_PARAMS[formula][sex]
  const inchesOverBase = heightCm / CM_PER_INCH - BASE_HEIGHT_INCHES

  return roundWeight(params.baseKg + params.perInchKg * inchesOverBase)
}

export function calculateBmiWeightRange(heightCm: number): { minKg: number; maxKg: number } | null {
  if (!Number.isFinite(heightCm) || heightCm <= 0) return null

  const heightM = heightCm / 100

  return {
    minKg: roundWeight(18.5 * heightM * heightM),
    maxKg: roundWeight(24.9 * heightM * heightM),
  }
}

export function calculateIdealWeightResult(sex: IdealWeightSex, heightCm: number): IdealWeightResult | null {
  if (!Number.isFinite(heightCm) || heightCm <= 0) return null

  const formulas: IdealWeightFormulaResult[] = (Object.keys(FORMULA_PARAMS) as IdealWeightFormula[])
    .map(formula => ({
      formula,
      weightKg: calculateFormulaWeight(sex, heightCm, formula),
    }))
    .filter((item): item is IdealWeightFormulaResult => item.weightKg !== null)

  if (formulas.length === 0) return null

  const bmiRange = calculateBmiWeightRange(heightCm)
  if (bmiRange === null) return null

  const weights = formulas.map(item => item.weightKg)
  const recommendedKg = roundWeight(weights.reduce((sum, value) => sum + value, 0) / weights.length)

  return {
    recommendedKg,
    minFormulaKg: roundWeight(Math.min(...weights)),
    maxFormulaKg: roundWeight(Math.max(...weights)),
    bmiMinKg: bmiRange.minKg,
    bmiMaxKg: bmiRange.maxKg,
    formulas,
  }
}
