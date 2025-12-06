import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useDateCalculator() {
  const getNextNewYear = () => {
    const now = new Date();
    return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0); // Jan 1st next year
  };

  // Load from storage or default to next New Year
  const storedDate = localStorage.getItem('calcup_target_date');
  const initialDate = storedDate ? new Date(storedDate) : getNextNewYear();

  // If stored date is in the past, maybe reset? For now, keep it.
  
  const targetDate = ref<Date>(initialDate);
  const now = ref(new Date());
  const timer = ref<number | null>(null);

  const updateNow = () => {
    now.value = new Date();
  };

  onMounted(() => {
    updateNow();
    timer.value = window.setInterval(updateNow, 1000);
  });

  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value);
    }
  });

  const setTargetDate = (date: Date) => {
    targetDate.value = date;
    localStorage.setItem('calcup_target_date', date.toISOString());
  };

  const timeRemaining = computed(() => {
    const diff = targetDate.value.getTime() - now.value.getTime();
    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { total: diff, days, hours, minutes, seconds };
  });

  const formattedTime = computed(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const { days, hours, minutes, seconds } = timeRemaining.value;
    return {
      days: days.toString().padStart(3, '0'), // Allow 3 digits for days
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds)
    };
  });

  return {
    targetDate,
    setTargetDate,
    timeRemaining,
    formattedTime
  };
}
