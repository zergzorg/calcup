import type { MetronomeCadenceMode, MetronomeInput, MetronomeResult } from '../types/metronome'

const BPM_MIN = 30
const BPM_MAX = 260
const BEATS_PER_BAR_MIN = 1
const BEATS_PER_BAR_MAX = 12
const DURATION_MIN = 1
const DURATION_MAX = 180

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) return Number.NaN
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max
}

export function isBpmValid(value: number): boolean {
  return isIntegerInRange(value, BPM_MIN, BPM_MAX)
}

export function isBeatsPerBarValid(value: number): boolean {
  return isIntegerInRange(value, BEATS_PER_BAR_MIN, BEATS_PER_BAR_MAX)
}

export function isDurationValid(value: number): boolean {
  return isIntegerInRange(value, DURATION_MIN, DURATION_MAX)
}

export function calculateTargetCadence(bpm: number, mode: MetronomeCadenceMode): number {
  return mode === 'everyOtherStep' ? bpm * 2 : bpm
}

export function calculateMetronome(input: MetronomeInput): MetronomeResult | null {
  if (!isBpmValid(input.bpm) || !isBeatsPerBarValid(input.beatsPerBar) || !isDurationValid(input.durationMinutes)) {
    return null
  }

  const intervalMs = 60000 / input.bpm
  const durationSeconds = input.durationMinutes * 60

  return {
    bpm: input.bpm,
    intervalMs: Math.round(intervalMs),
    beatIntervalSeconds: roundTo(intervalMs / 1000, 3),
    beatsPerBar: input.beatsPerBar,
    barSeconds: roundTo((intervalMs * input.beatsPerBar) / 1000, 2),
    durationMinutes: input.durationMinutes,
    totalBeats: Math.round(durationSeconds / (intervalMs / 1000)),
    targetCadenceSpm: calculateTargetCadence(input.bpm, input.cadenceMode),
  }
}
