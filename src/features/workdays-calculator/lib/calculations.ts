import type { DateOnly, WorkdaysDirection, WorkdaysResult } from '../types/workdays'

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

function isWeekend(utcMs: number): boolean {
  const weekday = new Date(utcMs).getUTCDay()
  return weekday === 0 || weekday === 6
}

export function calculateWorkdays(
  startDate: string,
  endDate: string,
  options: { includeEndDate?: boolean } = {},
): WorkdaysResult | null {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end) return null

  const startMs = toUtcMs(start)
  const endMs = toUtcMs(end)
  const direction: WorkdaysDirection = endMs > startMs ? 'future' : endMs < startMs ? 'past' : 'same'
  const [earlierMs, laterMs] = startMs <= endMs ? [startMs, endMs] : [endMs, startMs]
  const includeEndDate = options.includeEndDate ?? true
  const diffDays = Math.round((laterMs - earlierMs) / DAY_MS)
  const calendarDays = diffDays + (includeEndDate ? 1 : 0)

  let workdays = 0
  for (let i = 0; i < calendarDays; i += 1) {
    if (!isWeekend(earlierMs + i * DAY_MS)) {
      workdays += 1
    }
  }

  return {
    workdays,
    weekendDays: calendarDays - workdays,
    calendarDays,
    fullWeeks: Math.floor(calendarDays / 7),
    direction,
  }
}
