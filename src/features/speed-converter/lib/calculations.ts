import type { SpeedUnit } from '../types/speed'

export const SPEED_UNITS: SpeedUnit[] = [
  'kilometerPerHour',
  'meterPerSecond',
  'milePerHour',
  'knot',
  'footPerSecond',
  'minutePerKilometer',
]

const METERS_PER_SECOND: Record<Exclude<SpeedUnit, 'minutePerKilometer'>, number> = {
  kilometerPerHour: 1000 / 3600,
  meterPerSecond: 1,
  milePerHour: 0.44704,
  knot: 0.5144444444444445,
  footPerSecond: 0.3048,
}

function toMetersPerSecond(value: number, unit: SpeedUnit): number | null {
  if (unit === 'minutePerKilometer') {
    if (value <= 0) {
      return null
    }

    return 1000 / (value * 60)
  }

  return value * METERS_PER_SECOND[unit]
}

function fromMetersPerSecond(value: number, unit: SpeedUnit): number | null {
  if (unit === 'minutePerKilometer') {
    if (value <= 0) {
      return null
    }

    return 1000 / value / 60
  }

  return value / METERS_PER_SECOND[unit]
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null
  }

  const metersPerSecond = toMetersPerSecond(value, from)
  if (metersPerSecond === null) {
    return null
  }

  return fromMetersPerSecond(metersPerSecond, to)
}
