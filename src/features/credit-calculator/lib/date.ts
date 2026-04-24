const ISO_DATE_LENGTH = 10;

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, ISO_DATE_LENGTH);
}

export function parseIsoDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function addMonths(dateValue: string, months: number) {
  const date = parseIsoDate(dateValue);
  if (!date) return dateValue;

  const day = date.getDate();
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + months);

  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));

  return toIsoDate(next);
}

export function todayIsoDate() {
  return toIsoDate(new Date());
}

export function defaultFirstPaymentDate(issueDate = todayIsoDate()) {
  return addMonths(issueDate, 1);
}

export function compareIsoDates(left: string, right: string) {
  return left.localeCompare(right);
}

export function formatDisplayDate(value: string, locale: string) {
  const date = parseIsoDate(value);
  if (!date) return value;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
