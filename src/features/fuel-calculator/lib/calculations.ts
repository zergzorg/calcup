export function isValidPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calcConsumptionPer100Km(distanceKm: number, fuelLiters: number): number | null {
  if (!isValidPositive(distanceKm) || !isValidPositive(fuelLiters)) return null
  return round2((fuelLiters / distanceKm) * 100)
}

export function calcRequiredFuel(distanceKm: number, consumptionPer100Km: number): number | null {
  if (!isValidPositive(distanceKm) || !isValidPositive(consumptionPer100Km)) return null
  return round2((distanceKm * consumptionPer100Km) / 100)
}

export function calcTripCost(
  distanceKm: number,
  consumptionPer100Km: number,
  fuelPricePerLiter: number,
): { liters: number; cost: number } | null {
  if (!isValidPositive(distanceKm) || !isValidPositive(consumptionPer100Km)) return null
  if (!isValidNonNegative(fuelPricePerLiter)) return null
  const liters = round2((distanceKm * consumptionPer100Km) / 100)
  const cost = round2(liters * fuelPricePerLiter)
  return { liters, cost }
}
