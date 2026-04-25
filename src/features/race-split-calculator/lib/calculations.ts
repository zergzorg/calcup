import type { RaceSplitInput, RaceSplitPoint, RaceSplitResult } from '../types/race-split'

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function timeToSeconds(hours: number, minutes: number, seconds: number): number | null {
  if (!isNonNegativeInteger(hours) || !isNonNegativeInteger(minutes) || !isNonNegativeInteger(seconds)) return null
  if (minutes >= 60 || seconds >= 60) return null

  const total = hours * 3600 + minutes * 60 + seconds
  return total > 0 ? total : null
}

export function secondsToParts(totalSeconds: number) {
  const rounded = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(rounded / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const seconds = rounded % 60
  return { hours, minutes, seconds }
}

export function buildSplitPoints(distanceKm: number, splitDistanceKm: number, paceSecondsPerKm: number): RaceSplitPoint[] {
  if (!isPositive(distanceKm) || !isPositive(splitDistanceKm) || !isPositive(paceSecondsPerKm)) return []

  const points: RaceSplitPoint[] = []
  let current = splitDistanceKm

  while (current < distanceKm && points.length < 100) {
    points.push({
      distanceKm: roundTo(current, 3),
      cumulativeSeconds: Math.round(current * paceSecondsPerKm),
    })
    current += splitDistanceKm
  }

  points.push({
    distanceKm: roundTo(distanceKm, 3),
    cumulativeSeconds: Math.round(distanceKm * paceSecondsPerKm),
  })

  return points
}

export function calculateRaceSplits(input: RaceSplitInput): RaceSplitResult | null {
  if (!isPositive(input.distanceKm) || !isPositive(input.splitDistanceKm) || input.splitDistanceKm > input.distanceKm) return null

  const totalSeconds = timeToSeconds(input.hours, input.minutes, input.seconds)
  if (totalSeconds === null) return null

  const paceSecondsPerKm = totalSeconds / input.distanceKm
  const speedKmH = input.distanceKm / (totalSeconds / 3600)

  return {
    distanceKm: roundTo(input.distanceKm, 3),
    totalSeconds,
    paceSecondsPerKm: Math.round(paceSecondsPerKm),
    speedKmH: roundTo(speedKmH, 2),
    splits: buildSplitPoints(input.distanceKm, input.splitDistanceKm, paceSecondsPerKm),
  }
}
