import type {
  DateOnly,
  PregnancyDueDateInput,
  PregnancyDueDateResult,
  PregnancyTrimester,
  PregnancyTimelineStatus,
} from '../types/pregnancyDueDate'

const DAY_MS = 86_400_000
const DAYS_FROM_LMP_TO_DUE = 280
const DAYS_FROM_CONCEPTION_TO_DUE = 266
const DAYS_FROM_LMP_TO_CONCEPTION = 14

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

export function getTrimester(gestationalAgeTotalDays: number): PregnancyTrimester {
  if (gestationalAgeTotalDays < 14 * 7) return 'first'
  if (gestationalAgeTotalDays < 28 * 7) return 'second'
  return 'third'
}

function getTimelineStatus(gestationalAgeTotalDays: number, daysUntilDue: number): PregnancyTimelineStatus {
  if (gestationalAgeTotalDays < 0) return 'beforeStart'
  if (daysUntilDue === 0) return 'dueToday'
  if (daysUntilDue < 0) return 'pastDue'
  return 'inProgress'
}

export function calculatePregnancyDueDate(input: PregnancyDueDateInput): PregnancyDueDateResult | null {
  const today = parseDateOnly(input.todayDate)
  if (!today) return null

  const anchor = input.mode === 'lmp'
    ? parseDateOnly(input.lmpDate)
    : parseDateOnly(input.conceptionDate)

  if (!anchor) return null

  const pregnancyStart = input.mode === 'lmp'
    ? anchor
    : addDays(anchor, -DAYS_FROM_LMP_TO_CONCEPTION)

  const dueDate = input.mode === 'lmp'
    ? addDays(anchor, DAYS_FROM_LMP_TO_DUE)
    : addDays(anchor, DAYS_FROM_CONCEPTION_TO_DUE)

  const rawGestationalAgeDays = diffDays(pregnancyStart, today)
  const gestationalAgeTotalDays = Math.max(0, rawGestationalAgeDays)
  const daysUntilDue = diffDays(today, dueDate)

  return {
    mode: input.mode,
    dueDate: formatDateOnly(dueDate),
    pregnancyStartDate: formatDateOnly(pregnancyStart),
    gestationalAgeTotalDays,
    gestationalWeeks: Math.floor(gestationalAgeTotalDays / 7),
    gestationalDays: gestationalAgeTotalDays % 7,
    daysUntilDue,
    trimester: getTrimester(gestationalAgeTotalDays),
    status: getTimelineStatus(rawGestationalAgeDays, daysUntilDue),
  }
}
