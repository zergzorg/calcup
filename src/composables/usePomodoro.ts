import { ref, computed, onUnmounted } from 'vue';

export type TimerMode = 'WORK' | 'REST';

export function usePomodoro() {
  const workMinutes = ref(25);
  const restMinutes = ref(5);
  const currentSeconds = ref(0);
  const totalSeconds = ref(0);
  const isActive = ref(false);
  const isPaused = ref(false);
  const currentMode = ref<TimerMode>('WORK');
  const completedSessions = ref(0);
  
  let timerInterval: number | null = null;

  const formatTime = computed(() => {
    const minutes = Math.floor(currentSeconds.value / 60).toString().padStart(2, '0');
    const seconds = (currentSeconds.value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const progress = computed(() => {
    if (totalSeconds.value === 0) return 0;
    return (1 - (currentSeconds.value / totalSeconds.value)) * 100;
  });

  const setupTimer = () => {
    if (currentMode.value === 'WORK') {
      totalSeconds.value = workMinutes.value * 60;
    } else {
      totalSeconds.value = restMinutes.value * 60;
    }
    currentSeconds.value = totalSeconds.value;
  };

  // Initialize
  setupTimer();

  const switchMode = () => {
    if (currentMode.value === 'WORK') {
      currentMode.value = 'REST';
    } else {
      currentMode.value = 'WORK';
      completedSessions.value++;
    }
    setupTimer();
  };

  const startTimer = () => {
    if (isPaused.value) {
      isPaused.value = false;
    } else {
      // If we are starting from scratch (not paused), ensure setup is correct
      // But usually setupTimer is called when mode changes or settings change
    }
    
    isActive.value = true;
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      if (currentSeconds.value > 0) {
        currentSeconds.value--;
      } else {
        switchMode();
      }
    }, 1000) as unknown as number;
  };

  const pauseTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    isActive.value = false;
    isPaused.value = true;
  };

  const toggleTimer = () => {
    if (isActive.value) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    isActive.value = false;
    isPaused.value = false;
    currentMode.value = 'WORK';
    completedSessions.value = 0;
    setupTimer();
  };

  const skipToNext = () => {
    switchMode();
    if (isActive.value) {
      if (timerInterval) clearInterval(timerInterval);
      startTimer();
    }
  };

  const incrementWork = () => {
    if (workMinutes.value < 60) {
      workMinutes.value++;
      if (!isActive.value && currentMode.value === 'WORK') {
        setupTimer();
      }
    }
  };

  const decrementWork = () => {
    if (workMinutes.value > 1) {
      workMinutes.value--;
      if (!isActive.value && currentMode.value === 'WORK') {
        setupTimer();
      }
    }
  };

  const incrementRest = () => {
    if (restMinutes.value < 30) {
      restMinutes.value++;
      if (!isActive.value && currentMode.value === 'REST') {
        setupTimer();
      }
    }
  };

  const decrementRest = () => {
    if (restMinutes.value > 1) {
      restMinutes.value--;
      if (!isActive.value && currentMode.value === 'REST') {
        setupTimer();
      }
    }
  };

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  return {
    workMinutes,
    restMinutes,
    currentSeconds,
    totalSeconds, // Exposed if needed for external calculations
    isActive,
    isPaused,
    currentMode,
    completedSessions,
    formatTime,
    progress,
    toggleTimer,
    resetTimer,
    skipToNext,
    incrementWork,
    decrementWork,
    incrementRest,
    decrementRest
  };
}
