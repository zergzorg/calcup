import type { EvRangeInput, EvRangeResult } from '../types/ev-range'

const KM_PER_MILE = 1.609344

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

export function isPercent(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100
}

export function calculateEvRange(input: EvRangeInput): EvRangeResult | null {
  if (!isPositive(input.batteryCapacityKwh) || !isPositive(input.consumptionKwhPer100Km)) return null
  if (!isPercent(input.currentChargePercent) || !isPercent(input.targetChargePercent) || !isPercent(input.reservePercent)) return null
  if (!isNonNegative(input.electricityPrice)) return null
  if (input.reservePercent >= input.currentChargePercent) return null

  const currentEnergyKwh = input.batteryCapacityKwh * input.currentChargePercent / 100
  const targetEnergyKwh = input.batteryCapacityKwh * input.targetChargePercent / 100
  const reserveEnergyKwh = input.batteryCapacityKwh * input.reservePercent / 100
  const usableEnergyKwh = currentEnergyKwh - reserveEnergyKwh
  const rangeKm = usableEnergyKwh / input.consumptionKwhPer100Km * 100
  const chargeEnergyKwh = Math.max(targetEnergyKwh - currentEnergyKwh, 0)
  const chargeCost = input.electricityPrice > 0 ? chargeEnergyKwh * input.electricityPrice : null
  const costPer100Km = input.electricityPrice > 0 ? input.consumptionKwhPer100Km * input.electricityPrice : null

  return {
    currentEnergyKwh: roundTo(currentEnergyKwh, 2),
    targetEnergyKwh: roundTo(targetEnergyKwh, 2),
    chargeEnergyKwh: roundTo(chargeEnergyKwh, 2),
    usableEnergyKwh: roundTo(usableEnergyKwh, 2),
    rangeKm: roundTo(rangeKm, 1),
    rangeMiles: roundTo(rangeKm / KM_PER_MILE, 1),
    chargeCost: chargeCost === null ? null : roundTo(chargeCost, 2),
    costPer100Km: costPer100Km === null ? null : roundTo(costPer100Km, 2),
  }
}
