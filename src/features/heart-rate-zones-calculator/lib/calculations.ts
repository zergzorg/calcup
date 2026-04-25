import type { HeartRateZone, HeartRateZoneMethod, HeartRateZonesResult } from '../types/heart-rate-zones'

export const HEART_RATE_ZONE_DEFINITIONS: Array<Pick<HeartRateZone, 'key' | 'minPercent' | 'maxPercent'>> = [
  { key: 'z1', minPercent: 50, maxPercent: 60 },
  { key: 'z2', minPercent: 60, maxPercent: 70 },
  { key: 'z3', minPercent: 70, maxPercent: 80 },
  { key: 'z4', minPercent: 80, maxPercent: 90 },
  { key: 'z5', minPercent: 90, maxPercent: 100 },
]

export function estimateMaxHeartRate(age: number): number | null {
  if (!Number.isFinite(age) || age < 10 || age > 100) return null
  return Math.round(220 - age)
}

export function isValidHeartRate(value: number, min = 30, max = 240): boolean {
  return Number.isFinite(value) && value >= min && value <= max
}

function zoneBpm(percent: number, maxHeartRate: number, restingHeartRate: number | null, method: HeartRateZoneMethod): number {
  if (method === 'reserve' && restingHeartRate !== null) {
    return Math.round(restingHeartRate + (maxHeartRate - restingHeartRate) * (percent / 100))
  }

  return Math.round(maxHeartRate * (percent / 100))
}

export function calculateHeartRateZones(input: {
  age: number
  maxHeartRate?: number | null
  restingHeartRate?: number | null
  method: HeartRateZoneMethod
}): HeartRateZonesResult | null {
  const estimatedMax = estimateMaxHeartRate(input.age)
  const maxHeartRate = input.maxHeartRate && isValidHeartRate(input.maxHeartRate, 80, 240)
    ? Math.round(input.maxHeartRate)
    : estimatedMax

  if (maxHeartRate === null || !isValidHeartRate(maxHeartRate, 80, 240)) return null

  const restingHeartRate = input.method === 'reserve'
    ? Math.round(input.restingHeartRate ?? Number.NaN)
    : null

  if (input.method === 'reserve') {
    if (restingHeartRate === null || !isValidHeartRate(restingHeartRate, 30, 120) || restingHeartRate >= maxHeartRate) return null
  }

  return {
    maxHeartRate,
    restingHeartRate,
    method: input.method,
    zones: HEART_RATE_ZONE_DEFINITIONS.map(zone => ({
      ...zone,
      minBpm: zoneBpm(zone.minPercent, maxHeartRate, restingHeartRate, input.method),
      maxBpm: zoneBpm(zone.maxPercent, maxHeartRate, restingHeartRate, input.method),
    })),
  }
}
