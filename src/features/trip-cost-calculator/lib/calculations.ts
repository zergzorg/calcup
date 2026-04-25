import type { TripCostInput, TripCostResult } from '../types/trip-cost'

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function calculateTripCost(input: TripCostInput): TripCostResult | null {
  if (!isPositive(input.distanceKm) || !isPositive(input.consumptionPer100Km) || !isPositive(input.passengers)) return null
  if (!Number.isInteger(input.passengers)) return null
  if (!isNonNegative(input.fuelPricePerLiter) || !isNonNegative(input.tolls) || !isNonNegative(input.parking) || !isNonNegative(input.otherCosts)) return null

  const multiplier = input.direction === 'roundTrip' ? 2 : 1
  const effectiveDistanceKm = input.distanceKm * multiplier
  const fuelLiters = effectiveDistanceKm * input.consumptionPer100Km / 100
  const fuelCost = fuelLiters * input.fuelPricePerLiter
  const extraCosts = input.tolls + input.parking + input.otherCosts
  const totalCost = fuelCost + extraCosts

  return {
    effectiveDistanceKm: roundTo(effectiveDistanceKm, 2),
    fuelLiters: roundTo(fuelLiters, 2),
    fuelCost: roundTo(fuelCost, 2),
    extraCosts: roundTo(extraCosts, 2),
    totalCost: roundTo(totalCost, 2),
    costPerPerson: roundTo(totalCost / input.passengers, 2),
  }
}
