import type { CatAgeInput, CatAgeResult } from '../types/cat-age'

const MONTHS_PER_YEAR = 12

function roundHumanYears(value: number): number {
  return Math.round(value * 10) / 10
}

function getStageKey(catYears: number): string {
  if (catYears < 1) return 'kitten'
  if (catYears < 3) return 'young'
  if (catYears < 7) return 'adult'
  if (catYears < 11) return 'mature'
  if (catYears < 15) return 'senior'
  return 'geriatric'
}

export function calculateCatHumanYears(totalMonths: number): number | null {
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null

  const catYears = totalMonths / MONTHS_PER_YEAR
  if (catYears <= 0) return 0
  if (catYears <= 1) return roundHumanYears(catYears * 15)
  if (catYears <= 2) return roundHumanYears(15 + (catYears - 1) * 9)

  return roundHumanYears(24 + (catYears - 2) * 4)
}

export function calculateCatAge(input: CatAgeInput): CatAgeResult | null {
  const totalMonths = input.years * MONTHS_PER_YEAR + input.months
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null

  const humanYears = calculateCatHumanYears(totalMonths)
  if (humanYears === null) return null

  const catYears = roundHumanYears(totalMonths / MONTHS_PER_YEAR)

  return {
    totalMonths,
    catYears,
    humanYears,
    stageKey: getStageKey(catYears),
  }
}
