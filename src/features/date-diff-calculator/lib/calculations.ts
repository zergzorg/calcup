import type { DateDiffDirection, DateDiffResult, DateOnly } from '../types/date-diff'

export function parseDateOnly(value: string): DateOnly | null {
  if (typeof value !== 'string') return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const day = parseInt(match[3], 10)

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  // Round-trip UTC validation catches Feb 30, Apr 31, etc.
  const utcMs = Date.UTC(year, month - 1, day)
  const d = new Date(utcMs)
  if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) return null

  return { year, month, day }
}

export function isValidDateOnly(value: string): boolean {
  return parseDateOnly(value) !== null
}

export function compareDateOnly(a: DateOnly, b: DateOnly): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

function dateOnlyToUtcMs(date: DateOnly): number {
  return Date.UTC(date.year, date.month - 1, date.day)
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function calcBreakdown(earlier: DateOnly, later: DateOnly): { years: number; months: number; days: number } {
  // Full years: subtract 1 if we haven't reached the same month+day in the later year
  let years = later.year - earlier.year
  if (earlier.month > later.month || (earlier.month === later.month && earlier.day > later.day)) {
    years--
  }
  years = Math.max(0, years)

  // Remaining months after advancing by full years
  const afterYears: DateOnly = { year: earlier.year + years, month: earlier.month, day: earlier.day }
  let months = (later.year - afterYears.year) * 12 + (later.month - afterYears.month)
  if (later.day < afterYears.day) months--
  months = Math.max(0, months)

  // Advance afterYears by months, clamping day to the target month's length
  const rawMonth = afterYears.month + months - 1
  const advYear = afterYears.year + Math.floor(rawMonth / 12)
  const advMonth = (rawMonth % 12) + 1
  const advDay = Math.min(afterYears.day, daysInMonth(advYear, advMonth))
  const afterMonths: DateOnly = { year: advYear, month: advMonth, day: advDay }

  const remainingMs = dateOnlyToUtcMs(later) - dateOnlyToUtcMs(afterMonths)
  const days = Math.max(0, Math.round(remainingMs / 86_400_000))

  return { years, months, days }
}

export function calculateDayDifference(
  startStr: string,
  endStr: string,
  options: { includeEndDate?: boolean } = {},
): DateDiffResult | null {
  const start = parseDateOnly(startStr)
  const end = parseDateOnly(endStr)
  if (!start || !end) return null

  const startMs = dateOnlyToUtcMs(start)
  const endMs = dateOnlyToUtcMs(end)
  const diffMs = endMs - startMs
  const extra = options.includeEndDate ? 1 : 0

  const direction: DateDiffDirection = diffMs > 0 ? 'future' : diffMs < 0 ? 'past' : 'same'
  const absDays = Math.round(Math.abs(diffMs) / 86_400_000)
  const [earlier, later] = diffMs >= 0 ? [start, end] : [end, start]

  return {
    days: absDays + extra,
    direction,
    breakdown: calcBreakdown(earlier, later),
  }
}
