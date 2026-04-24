import { computed, ref } from 'vue';
import { useNow } from './useNow';

const STORAGE_KEY = 'calcup_target_date';

const getNextNewYear = () => {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
};

const loadInitial = (): Date => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getNextNewYear();
  const parsed = new Date(stored);
  if (isNaN(parsed.getTime())) return getNextNewYear();
  return parsed.getTime() <= Date.now() ? getNextNewYear() : parsed;
};

const toDatetimeLocal = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function useDateCalculator() {
  const { now } = useNow();
  const targetDate = ref<Date>(loadInitial());

  const setTargetDate = (date: Date) => {
    if (isNaN(date.getTime())) return;
    targetDate.value = date;
    localStorage.setItem(STORAGE_KEY, date.toISOString());
  };

  const setTargetFromLocalValue = (value: string) => {
    if (!value) return;
    setTargetDate(new Date(value));
  };

  const timeRemaining = computed(() => {
    const diff = targetDate.value.getTime() - now.value.getTime();
    if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  const isExpired = computed(() => targetDate.value.getTime() <= now.value.getTime());
  const inputValue = computed(() => toDatetimeLocal(targetDate.value));
  const progress = computed(() => {
    const startedAt = now.value.getFullYear() === targetDate.value.getFullYear()
      ? new Date(now.value.getFullYear(), 0, 1).getTime()
      : now.value.getTime();
    const total = Math.max(1, targetDate.value.getTime() - startedAt);
    const elapsed = Math.max(0, now.value.getTime() - startedAt);
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  });

  const formattedTime = computed(() => {
    const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
    const { days, hours, minutes, seconds } = timeRemaining.value;
    return {
      days: pad(days, 3),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  });

  return {
    targetDate,
    setTargetDate,
    setTargetFromLocalValue,
    timeRemaining,
    formattedTime,
    isExpired,
    inputValue,
    progress,
  };
}
