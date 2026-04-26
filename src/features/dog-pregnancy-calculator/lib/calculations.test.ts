import { describe, expect, it } from 'vitest'
import {
  addDays,
  calculateDogPregnancy,
  diffDays,
  formatDateOnly,
  getDogPregnancyPhase,
  getDogPregnancyWindow,
  parseDateOnly,
} from './calculations'

describe('dog pregnancy date helpers', () => {
  it('parses and formats valid ISO dates', () => {
    const date = parseDateOnly('2026-04-26')

    expect(date).toEqual({ year: 2026, month: 4, day: 26 })
    expect(date && formatDateOnly(date)).toBe('2026-04-26')
  })

  it('rejects impossible dates', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(parseDateOnly('26-04-2026')).toBeNull()
  })

  it('adds and diffs days in UTC', () => {
    const start = parseDateOnly('2026-12-20')!
    const end = addDays(start, 20)

    expect(formatDateOnly(end)).toBe('2027-01-09')
    expect(diffDays(start, end)).toBe(20)
  })
})

describe('dog pregnancy windows and phases', () => {
  it('uses a wider window from mating and a narrower one from ovulation', () => {
    expect(getDogPregnancyWindow('mating')).toEqual({ earliest: 57, latest: 65 })
    expect(getDogPregnancyWindow('ovulation')).toEqual({ earliest: 62, latest: 64 })
  })

  it('classifies pregnancy timeline phases', () => {
    expect(getDogPregnancyPhase(-1, 58, 66)).toBe('beforeStart')
    expect(getDogPregnancyPhase(10, 47, 55)).toBe('early')
    expect(getDogPregnancyPhase(30, 27, 35)).toBe('mid')
    expect(getDogPregnancyPhase(50, 7, 15)).toBe('late')
    expect(getDogPregnancyPhase(60, -3, 5)).toBe('whelpingWindow')
    expect(getDogPregnancyPhase(66, -9, -1)).toBe('pastWindow')
  })
})

describe('calculateDogPregnancy', () => {
  it('calculates due date and wider window from mating date', () => {
    expect(calculateDogPregnancy({
      mode: 'mating',
      matingDate: '2026-04-01',
      ovulationDate: '2026-04-03',
      todayDate: '2026-05-01',
    })).toEqual({
      mode: 'mating',
      anchorDate: '2026-04-01',
      dueDate: '2026-06-03',
      earliestDate: '2026-05-28',
      latestDate: '2026-06-05',
      dayOfPregnancy: 30,
      daysUntilDue: 33,
      daysUntilEarliest: 27,
      daysUntilLatest: 35,
      phase: 'mid',
    })
  })

  it('calculates narrower window from ovulation date', () => {
    expect(calculateDogPregnancy({
      mode: 'ovulation',
      matingDate: '2026-04-01',
      ovulationDate: '2026-04-03',
      todayDate: '2026-06-05',
    })).toMatchObject({
      mode: 'ovulation',
      anchorDate: '2026-04-03',
      dueDate: '2026-06-05',
      earliestDate: '2026-06-04',
      latestDate: '2026-06-06',
      dayOfPregnancy: 63,
      daysUntilDue: 0,
      phase: 'whelpingWindow',
    })
  })

  it('returns null when the active date is invalid', () => {
    expect(calculateDogPregnancy({
      mode: 'mating',
      matingDate: '',
      ovulationDate: '2026-04-03',
      todayDate: '2026-05-01',
    })).toBeNull()
  })
})
