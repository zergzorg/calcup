import { ref, computed } from 'vue';
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
  return isNaN(parsed.getTime()) ? getNextNewYear() : parsed;
};

export function useDateCalculator() {
  const { now } = useNow();
  const targetDate = ref<Date>(loadInitial());

  const setTargetDate = (date: Date) => {
    targetDate.value = date;
    localStorage.setItem(STORAGE_KEY, date.toISOString());
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
    timeRemaining,
    formattedTime,
  };
}
