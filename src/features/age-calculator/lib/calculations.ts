import type { AgeBreakdown, AgeResult, DateOnly } from '../types/age'

const DAY_MS = 86_400_000

export function parseDateOnly(value: string): DateOnly | null {
  if (typeof value !== 'string') return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return null

  return { year, month, day }
}

export function compareDateOnly(a: DateOnly, b: DateOnly): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

function toUtcMs(date: DateOnly): number {
  return Date.UTC(date.year, date.month - 1, date.day)
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function addMonths(date: DateOnly, months: number): DateOnly {
  const monthIndex = date.month - 1 + months
  const year = date.year + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) }
}

function calculateBreakdown(birth: DateOnly, target: DateOnly): AgeBreakdown {
  let years = target.year - birth.year
  if (birth.month > target.month || (birth.month === target.month && birth.day > target.day)) {
    years -= 1
  }
  years = Math.max(0, years)

  const afterYears = addMonths(birth, years * 12)
  let months = (target.year - afterYears.year) * 12 + target.month - afterYears.month
  if (target.day < afterYears.day) months -= 1
  months = Math.max(0, months)

  const afterMonths = addMonths(afterYears, months)
  const days = Math.max(0, Math.round((toUtcMs(target) - toUtcMs(afterMonths)) / DAY_MS))

  return { years, months, days }
}

function birthdayInYear(birth: DateOnly, year: number): DateOnly {
  if (birth.month === 2 && birth.day === 29 && !isLeapYear(year)) {
    return { year, month: 2, day: 28 }
  }
  return { year, month: birth.month, day: birth.day }
}

export function calculateAge(birthDate: string, targetDate: string): AgeResult | null {
  const birth = parseDateOnly(birthDate)
  const target = parseDateOnly(targetDate)
  if (!birth || !target || compareDateOnly(target, birth) < 0) return null

  const totalDays = Math.round((toUtcMs(target) - toUtcMs(birth)) / DAY_MS)
  const age = calculateBreakdown(birth, target)

  let nextBirthday = birthdayInYear(birth, target.year)
  if (compareDateOnly(nextBirthday, target) < 0) {
    nextBirthday = birthdayInYear(birth, target.year + 1)
  }

  return {
    age,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: age.years * 12 + age.months,
    nextBirthday,
    daysUntilBirthday: Math.round((toUtcMs(nextBirthday) - toUtcMs(target)) / DAY_MS),
    nextBirthdayAge: nextBirthday.year - birth.year,
  }
}

export function formatDateOnly(date: DateOnly): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
}
