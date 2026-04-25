import type { AverageSpeedInput, AverageSpeedResult } from '../types/average-speed'

const KM_PER_MILE = 1.609344
const METERS_PER_KILOMETER = 1000
const SECONDS_PER_HOUR = 3600

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function calculateAverageSpeed(input: AverageSpeedInput): AverageSpeedResult | null {
  if (!isPositive(input.distanceKm) || !isNonNegative(input.hours) || !isNonNegative(input.minutes)) return null

  const totalMinutes = input.hours * 60 + input.minutes
  if (!isPositive(totalMinutes)) return null

  const totalHours = totalMinutes / 60
  const speedKmH = input.distanceKm / totalHours
  const speedMph = speedKmH / KM_PER_MILE
  const speedMs = speedKmH * METERS_PER_KILOMETER / SECONDS_PER_HOUR
  const paceSecondsPerKm = totalMinutes * 60 / input.distanceKm

  return {
    totalMinutes: roundTo(totalMinutes, 1),
    speedKmH: roundTo(speedKmH, 2),
    speedMph: roundTo(speedMph, 2),
    speedMs: roundTo(speedMs, 2),
    paceSecondsPerKm: roundTo(paceSecondsPerKm, 0),
  }
}
