import { CONVERSION_UNITS_CONFIG } from '../../../config'
import type { SpeedUnit } from '../types/speed'

export const SPEED_UNITS = CONVERSION_UNITS_CONFIG.speed.units as SpeedUnit[]

const METERS_PER_SECOND = CONVERSION_UNITS_CONFIG.speed.metersPerSecond as Record<Exclude<SpeedUnit, 'minutePerKilometer'>, number>

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
