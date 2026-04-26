import type { CatPregnancyInput, CatPregnancyPhase, CatPregnancyResult } from '../types/cat-pregnancy'

interface DateOnly {
  year: number
  month: number
  day: number
}

const DAY_MS = 86_400_000
const AVERAGE_GESTATION_DAYS = 64
const QUEENING_WINDOW = { earliest: 60, latest: 67 }

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

export function getCatPregnancyWindow(): { earliest: number, latest: number } {
  return QUEENING_WINDOW
}

export function getCatPregnancyPhase(dayOfPregnancy: number, daysUntilEarliest: number, daysUntilLatest: number): CatPregnancyPhase {
  if (dayOfPregnancy < 0) return 'beforeStart'
  if (daysUntilLatest < 0) return 'pastWindow'
  if (daysUntilEarliest <= 0) return 'queeningWindow'
  if (dayOfPregnancy < 21) return 'early'
  if (dayOfPregnancy < 42) return 'mid'
  return 'late'
}

export function calculateCatPregnancy(input: CatPregnancyInput): CatPregnancyResult | null {
  const today = parseDateOnly(input.todayDate)
  const matingDate = parseDateOnly(input.matingDate)

  if (!today || !matingDate) return null

  const window = getCatPregnancyWindow()
  const dueDate = addDays(matingDate, AVERAGE_GESTATION_DAYS)
  const earliestDate = addDays(matingDate, window.earliest)
  const latestDate = addDays(matingDate, window.latest)
  const rawDayOfPregnancy = diffDays(matingDate, today)
  const daysUntilDue = diffDays(today, dueDate)
  const daysUntilEarliest = diffDays(today, earliestDate)
  const daysUntilLatest = diffDays(today, latestDate)

  return {
    matingDate: formatDateOnly(matingDate),
    dueDate: formatDateOnly(dueDate),
    earliestDate: formatDateOnly(earliestDate),
    latestDate: formatDateOnly(latestDate),
    dayOfPregnancy: Math.max(0, rawDayOfPregnancy),
    daysUntilDue,
    daysUntilEarliest,
    daysUntilLatest,
    phase: getCatPregnancyPhase(rawDayOfPregnancy, daysUntilEarliest, daysUntilLatest),
  }
}
