import type {
  DogPregnancyInput,
  DogPregnancyMode,
  DogPregnancyPhase,
  DogPregnancyResult,
} from '../types/dog-pregnancy'

interface DateOnly {
  year: number
  month: number
  day: number
}

const DAY_MS = 86_400_000
const AVERAGE_GESTATION_DAYS = 63
const MATING_WINDOW = { earliest: 57, latest: 65 }
const OVULATION_WINDOW = { earliest: 62, latest: 64 }

export function parseDateOnly(value: string): DateOnly | null {
  if (typeof value !== 'string') return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    return null
  }

  return { year, month, day }
}

function toUtcMs(date: DateOnly): number {
  return Date.UTC(date.year, date.month - 1, date.day)
}

function fromUtcMs(value: number): DateOnly {
  const date = new Date(value)

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export function formatDateOnly(date: DateOnly): string {
  const year = String(date.year).padStart(4, '0')
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function addDays(date: DateOnly, days: number): DateOnly {
  return fromUtcMs(toUtcMs(date) + days * DAY_MS)
}

export function diffDays(startDate: DateOnly, endDate: DateOnly): number {
  return Math.round((toUtcMs(endDate) - toUtcMs(startDate)) / DAY_MS)
}

export function getDogPregnancyWindow(mode: DogPregnancyMode): { earliest: number, latest: number } {
  return mode === 'ovulation' ? OVULATION_WINDOW : MATING_WINDOW
}

export function getDogPregnancyPhase(dayOfPregnancy: number, daysUntilEarliest: number, daysUntilLatest: number): DogPregnancyPhase {
  if (dayOfPregnancy < 0) return 'beforeStart'
  if (daysUntilLatest < 0) return 'pastWindow'
  if (daysUntilEarliest <= 0) return 'whelpingWindow'
  if (dayOfPregnancy < 21) return 'early'
  if (dayOfPregnancy < 42) return 'mid'
  return 'late'
}

export function calculateDogPregnancy(input: DogPregnancyInput): DogPregnancyResult | null {
  const today = parseDateOnly(input.todayDate)
  if (!today) return null

  const anchor = input.mode === 'ovulation'
    ? parseDateOnly(input.ovulationDate)
    : parseDateOnly(input.matingDate)

  if (!anchor) return null

  const window = getDogPregnancyWindow(input.mode)
  const dueDate = addDays(anchor, AVERAGE_GESTATION_DAYS)
  const earliestDate = addDays(anchor, window.earliest)
  const latestDate = addDays(anchor, window.latest)
  const rawDayOfPregnancy = diffDays(anchor, today)
  const daysUntilDue = diffDays(today, dueDate)
  const daysUntilEarliest = diffDays(today, earliestDate)
  const daysUntilLatest = diffDays(today, latestDate)

  return {
    mode: input.mode,
    anchorDate: formatDateOnly(anchor),
    dueDate: formatDateOnly(dueDate),
    earliestDate: formatDateOnly(earliestDate),
    latestDate: formatDateOnly(latestDate),
    dayOfPregnancy: Math.max(0, rawDayOfPregnancy),
    daysUntilDue,
    daysUntilEarliest,
    daysUntilLatest,
    phase: getDogPregnancyPhase(rawDayOfPregnancy, daysUntilEarliest, daysUntilLatest),
  }
}
