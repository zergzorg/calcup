import type { CountdownDirection, CountdownResult, DateOnly } from '../types/countdown'

const DAY_MS = 86_400_000

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

export function calculateCountdown(
  startDate: string,
  targetDate: string,
  options: { includeStartDate?: boolean } = {},
): CountdownResult | null {
  const start = parseDateOnly(startDate)
  const target = parseDateOnly(targetDate)
  if (!start || !target) return null

  const diffDays = Math.round((toUtcMs(target) - toUtcMs(start)) / DAY_MS)
  const direction: CountdownDirection = diffDays > 0 ? 'future' : diffDays < 0 ? 'past' : 'today'
  const absoluteDays = Math.abs(diffDays)
  const calendarDays = absoluteDays + (options.includeStartDate && absoluteDays > 0 ? 1 : 0)

  return {
    days: absoluteDays,
    calendarDays,
    fullWeeks: Math.floor(calendarDays / 7),
    remainingDays: calendarDays % 7,
    direction,
  }
}
