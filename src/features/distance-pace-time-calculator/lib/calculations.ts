import type {
  DistancePaceTimeResult,
  PaceInput,
  PaceParts,
  TimeInput,
  TimeParts,
} from '../types/distance-pace-time'

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isValidPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isValidTimeInput(input: TimeInput): boolean {
  if (!Number.isInteger(input.hours) || !Number.isInteger(input.minutes) || !Number.isInteger(input.seconds)) {
    return false
  }
  if (input.hours < 0 || input.minutes < 0 || input.seconds < 0) return false
  if (input.minutes >= 60 || input.seconds >= 60) return false
  return input.hours * 3600 + input.minutes * 60 + input.seconds > 0
}

export function isValidPaceInput(input: PaceInput): boolean {
  if (!Number.isInteger(input.minutes) || !Number.isInteger(input.seconds)) return false
  if (input.minutes < 0 || input.seconds < 0 || input.seconds >= 60) return false
  return input.minutes * 60 + input.seconds > 0
}

export function timeInputToSeconds(input: TimeInput): number | null {
  if (!isValidTimeInput(input)) return null
  return input.hours * 3600 + input.minutes * 60 + input.seconds
}

export function paceInputToSeconds(input: PaceInput): number | null {
  if (!isValidPaceInput(input)) return null
  return input.minutes * 60 + input.seconds
}

export function secondsToTimeParts(totalSeconds: number): TimeParts | null {
  if (!isValidPositive(totalSeconds)) return null
  const rounded = Math.round(totalSeconds)
  const hours = Math.floor(rounded / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const seconds = rounded % 60
  return { hours, minutes, seconds, totalSeconds: rounded }
}

export function secondsToPaceParts(totalSeconds: number): PaceParts | null {
  if (!isValidPositive(totalSeconds)) return null
  const rounded = Math.round(totalSeconds)
  const minutes = Math.floor(rounded / 60)
  const seconds = rounded % 60
  return { minutes, seconds, totalSeconds: rounded }
}

export function calculateTimeByDistanceAndPace(
  distanceKm: number,
  pace: PaceInput,
): DistancePaceTimeResult | null {
  if (!isValidPositive(distanceKm)) return null
  const paceSeconds = paceInputToSeconds(pace)
  if (paceSeconds === null) return null

  const totalSeconds = distanceKm * paceSeconds
  const time = secondsToTimeParts(totalSeconds)
  const paceParts = secondsToPaceParts(paceSeconds)
  if (!time || !paceParts) return null

  return {
    distanceKm: round(distanceKm, 3),
    time,
    pace: paceParts,
    speedKmH: round(3600 / paceSeconds),
  }
}

export function calculatePaceByDistanceAndTime(
  distanceKm: number,
  timeInput: TimeInput,
): DistancePaceTimeResult | null {
  if (!isValidPositive(distanceKm)) return null
  const totalSeconds = timeInputToSeconds(timeInput)
  if (totalSeconds === null) return null

  const paceSeconds = totalSeconds / distanceKm
  const time = secondsToTimeParts(totalSeconds)
  const pace = secondsToPaceParts(paceSeconds)
  if (!time || !pace) return null

  return {
    distanceKm: round(distanceKm, 3),
    time,
    pace,
    speedKmH: round(distanceKm / (totalSeconds / 3600)),
  }
}

export function calculateDistanceByTimeAndPace(
  timeInput: TimeInput,
  paceInput: PaceInput,
): DistancePaceTimeResult | null {
  const totalSeconds = timeInputToSeconds(timeInput)
  const paceSeconds = paceInputToSeconds(paceInput)
  if (totalSeconds === null || paceSeconds === null) return null

  const distanceKm = totalSeconds / paceSeconds
  const time = secondsToTimeParts(totalSeconds)
  const pace = secondsToPaceParts(paceSeconds)
  if (!time || !pace) return null

  return {
    distanceKm: round(distanceKm, 3),
    time,
    pace,
    speedKmH: round(3600 / paceSeconds),
  }
}
