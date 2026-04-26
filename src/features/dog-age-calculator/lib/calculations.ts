import type { DogAgeInput, DogAgeResult, DogSize } from '../types/dog-age'

const MONTHS_PER_YEAR = 12

const DOG_SIZE_RATE: Record<DogSize, number> = {
  small: 4,
  medium: 5,
  large: 6,
  giant: 7,
}

function roundHumanYears(value: number): number {
  return Math.round(value * 10) / 10
}

function getStageKey(dogYears: number): string {
  if (dogYears < 1) return 'puppy'
  if (dogYears < 3) return 'young'
  if (dogYears < 7) return 'adult'
  if (dogYears < 11) return 'senior'
  return 'geriatric'
}

export function calculateDogHumanYears(totalMonths: number, size: DogSize): number | null {
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null

  const dogYears = totalMonths / MONTHS_PER_YEAR
  if (dogYears <= 0) return 0
  if (dogYears <= 1) return roundHumanYears(dogYears * 15)
  if (dogYears <= 2) return roundHumanYears(15 + (dogYears - 1) * 9)

  return roundHumanYears(24 + (dogYears - 2) * DOG_SIZE_RATE[size])
}

export function calculateDogAge(input: DogAgeInput): DogAgeResult | null {
  const totalMonths = input.years * MONTHS_PER_YEAR + input.months
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null

  const humanYears = calculateDogHumanYears(totalMonths, input.size)
  if (humanYears === null) return null

  const dogYears = roundHumanYears(totalMonths / MONTHS_PER_YEAR)

  return {
    totalMonths,
    dogYears,
    humanYears,
    stageKey: getStageKey(dogYears),
    yearlyAgingRate: DOG_SIZE_RATE[input.size],
  }
}
