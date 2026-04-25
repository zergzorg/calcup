import type { PaceInput, PaceParts, PaceToSpeedResult, SpeedToPaceResult } from '../types/pace-speed'

export const MILE_IN_KILOMETERS = 1.609344

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isValidPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidPaceInput(input: PaceInput): boolean {
  if (!Number.isFinite(input.minutes) || !Number.isFinite(input.seconds)) return false
  if (!Number.isInteger(input.minutes) || !Number.isInteger(input.seconds)) return false
  if (input.minutes < 0 || input.seconds < 0 || input.seconds >= 60) return false
  return input.minutes + input.seconds / 60 > 0
}

export function paceInputToTotalMinutes(input: PaceInput): number | null {
  if (!isValidPaceInput(input)) return null
  return input.minutes + input.seconds / 60
}

export function totalMinutesToPaceParts(totalMinutes: number): PaceParts | null {
  if (!isValidPositive(totalMinutes)) return null
  let minutes = Math.floor(totalMinutes)
  let seconds = Math.round((totalMinutes - minutes) * 60)

  if (seconds === 60) {
    minutes += 1
    seconds = 0
  }

  return { minutes, seconds, totalMinutes }
}

export function convertPaceToSpeed(input: PaceInput): PaceToSpeedResult | null {
  const paceMinPerKm = paceInputToTotalMinutes(input)
  if (paceMinPerKm === null) return null

  const speedKmH = 60 / paceMinPerKm
  const paceMinPerMile = paceMinPerKm * MILE_IN_KILOMETERS
  const paceKmParts = totalMinutesToPaceParts(paceMinPerKm)
  const paceMileParts = totalMinutesToPaceParts(paceMinPerMile)

  if (!paceKmParts || !paceMileParts) return null

  return {
    speedKmH: round(speedKmH),
    speedMph: round(speedKmH / MILE_IN_KILOMETERS),
    paceMinPerKm: paceKmParts,
    paceMinPerMile: paceMileParts,
  }
}

export function convertSpeedToPace(speedKmH: number): SpeedToPaceResult | null {
  if (!isValidPositive(speedKmH)) return null

  const paceMinPerKm = 60 / speedKmH
  const paceMinPerMile = paceMinPerKm * MILE_IN_KILOMETERS
  const paceKmParts = totalMinutesToPaceParts(paceMinPerKm)
  const paceMileParts = totalMinutesToPaceParts(paceMinPerMile)

  if (!paceKmParts || !paceMileParts) return null

  return {
    speedKmH: round(speedKmH),
    speedMph: round(speedKmH / MILE_IN_KILOMETERS),
    paceMinPerKm: paceKmParts,
    paceMinPerMile: paceMileParts,
  }
}
