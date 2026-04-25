import type { FuelPriceInput, FuelPriceResult } from '../types/fuel-price'

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function calculateFuelPrice(input: FuelPriceInput): FuelPriceResult | null {
  if (!isPositive(input.budget) || !isPositive(input.pricePerLiter) || !isPositive(input.consumptionPer100Km)) return null

  const liters = input.budget / input.pricePerLiter
  const distanceKm = liters / input.consumptionPer100Km * 100
  const costPer100Km = input.consumptionPer100Km * input.pricePerLiter

  return {
    liters: roundTo(liters, 2),
    distanceKm: roundTo(distanceKm, 1),
    costPer100Km: roundTo(costPer100Km, 2),
  }
}
