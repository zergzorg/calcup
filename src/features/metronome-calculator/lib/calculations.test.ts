import { describe, expect, it } from 'vitest'
import { calculateMetronome, calculateTargetCadence, isBpmValid } from './calculations'

describe('metronome calculator', () => {
  it('calculates beat interval and bar length from BPM', () => {
    expect(calculateMetronome({
      bpm: 120,
      beatsPerBar: 4,
      durationMinutes: 5,
      cadenceMode: 'everyStep',
    })).toEqual({
      bpm: 120,
      intervalMs: 500,
      beatIntervalSeconds: 0.5,
      beatsPerBar: 4,
      barSeconds: 2,
      durationMinutes: 5,
      totalBeats: 600,
      targetCadenceSpm: 120,
    })
  })

  it('doubles target cadence when the beat marks every other step', () => {
    expect(calculateTargetCadence(90, 'everyOtherStep')).toBe(180)
  })

  it('rejects BPM outside the supported range', () => {
    expect(isBpmValid(29)).toBe(false)
    expect(isBpmValid(260)).toBe(true)
    expect(isBpmValid(261)).toBe(false)
  })

  it('returns null for invalid input', () => {
    expect(calculateMetronome({
      bpm: 120.5,
      beatsPerBar: 4,
      durationMinutes: 5,
      cadenceMode: 'everyStep',
    })).toBeNull()
  })
})
