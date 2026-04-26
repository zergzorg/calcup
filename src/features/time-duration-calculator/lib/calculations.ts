import type {
  DurationParts,
  TimeDurationOperation,
  TimeDurationResult,
} from '../types/time-duration'

export function toTotalSeconds(parts: DurationParts): number | null {
  const values = [parts.hours, parts.minutes, parts.seconds]
  if (values.some(value => !Number.isFinite(value) || value < 0 || !Number.isInteger(value))) {
    return null
  }

  return parts.hours * 3600 + parts.minutes * 60 + parts.seconds
}

export function normalizeSeconds(totalSeconds: number): DurationParts {
  const absolute = Math.abs(Math.trunc(totalSeconds))
  const hours = Math.floor(absolute / 3600)
  const minutes = Math.floor((absolute % 3600) / 60)
  const seconds = absolute % 60

  return { hours, minutes, seconds }
}

export function formatDuration(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : ''
  const parts = normalizeSeconds(totalSeconds)
  return `${sign}${String(parts.hours).padStart(2, '0')}:${String(parts.minutes).padStart(2, '0')}:${String(parts.seconds).padStart(2, '0')}`
}

export function calculateTimeDuration(
  first: DurationParts,
  second: DurationParts,
  operation: TimeDurationOperation,
): TimeDurationResult | null {
  const firstSeconds = toTotalSeconds(first)
  const secondSeconds = toTotalSeconds(second)
  if (firstSeconds === null || secondSeconds === null) return null

  const totalSeconds = operation === 'add' ? firstSeconds + secondSeconds : firstSeconds - secondSeconds
  const absoluteSeconds = Math.abs(totalSeconds)

  return {
    sign: totalSeconds < 0 ? -1 : 1,
    totalSeconds,
    absoluteSeconds,
    parts: normalizeSeconds(totalSeconds),
    formatted: formatDuration(totalSeconds),
    totalMinutes: absoluteSeconds / 60,
    totalHours: absoluteSeconds / 3600,
  }
}
