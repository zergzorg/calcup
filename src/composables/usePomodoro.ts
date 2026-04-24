import { ref, computed, onUnmounted, watch } from 'vue';
import { useTaskPomodoro } from './useTaskPomodoro';
import { playBreakStartSound, playBreakEndSound } from './usePomodoroSounds';

export type TimerMode = 'WORK' | 'REST' | 'LONG_REST';

const STORAGE_KEY = 'POMODORO_STATE';
const WORK_BOUNDS = { min: 1, max: 60 };
const REST_BOUNDS = { min: 1, max: 30 };
const LONG_REST_BOUNDS = { min: 5, max: 60 };
const DEFAULT_WORK = 25;
const DEFAULT_REST = 5;
const DEFAULT_LONG_REST = 15;
const SESSIONS_PER_CYCLE = 4;

interface PomodoroState {
  workMinutes: number;
  restMinutes: number;
  longRestMinutes: number;
  completedSessions: number;
  mode: TimerMode;
  currentSeconds: number;
  isActive: boolean;
  lastUpdated: number;
}

const loadState = (): PomodoroState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PomodoroState) : null;
  } catch (e) {
    console.warn('Failed to load pomodoro state', e);
    return null;
  }
};

export function usePomodoro() {
  const saved = loadState();

  const workMinutes = ref(saved?.workMinutes ?? DEFAULT_WORK);
  const restMinutes = ref(saved?.restMinutes ?? DEFAULT_REST);
  const longRestMinutes = ref(saved?.longRestMinutes ?? DEFAULT_LONG_REST);
  const currentMode = ref<TimerMode>(saved?.mode ?? 'WORK');
  const completedSessions = ref(saved?.completedSessions ?? 0);
  const sessionsPerCycle = ref(SESSIONS_PER_CYCLE);

  const modeDuration = (mode: TimerMode = currentMode.value): number => {
    switch (mode) {
      case 'WORK':
        return workMinutes.value * 60;
      case 'REST':
        return restMinutes.value * 60;
      case 'LONG_REST':
        return longRestMinutes.value * 60;
    }
  };

  const totalSeconds = ref(modeDuration());

  // Restore an in-flight session, accounting for elapsed wall-clock time.
  let restoredSeconds = totalSeconds.value;
  let restoredActive = false;
  if (saved) {
    restoredSeconds = saved.currentSeconds;
    restoredActive = saved.isActive;
    if (restoredActive && saved.lastUpdated) {
      const elapsed = Math.floor((Date.now() - saved.lastUpdated) / 1000);
      if (elapsed > 0) {
        restoredSeconds = Math.max(0, restoredSeconds - elapsed);
        if (restoredSeconds === 0) restoredActive = false;
      }
    }
  }

  const currentSeconds = ref(restoredSeconds);
  const isActive = ref(restoredActive);
  const isPaused = ref(saved ? !restoredActive && restoredSeconds < totalSeconds.value : false);

  let timerInterval: number | null = null;

  const saveState = () => {
    try {
      const state: PomodoroState = {
        workMinutes: workMinutes.value,
        restMinutes: restMinutes.value,
        longRestMinutes: longRestMinutes.value,
        completedSessions: completedSessions.value,
        mode: currentMode.value,
        currentSeconds: currentSeconds.value,
        isActive: isActive.value,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save pomodoro state', e);
    }
  };

  const resetCurrentSession = () => {
    totalSeconds.value = modeDuration();
    currentSeconds.value = totalSeconds.value;
  };

  const stopInterval = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const { addLiveTimerSecond, recordTimerSegment, timerStartSignal } = useTaskPomodoro();

  const switchMode = () => {
    const previousMode = currentMode.value;
    const plannedSeconds = totalSeconds.value;
    const actualSeconds = Math.max(0, plannedSeconds - currentSeconds.value);
    const completed = actualSeconds >= Math.max(plannedSeconds - 1, plannedSeconds * 0.95);

    recordTimerSegment(previousMode, plannedSeconds, actualSeconds, completed);

    if (currentMode.value === 'WORK') {
      if (completed) completedSessions.value++;
      const goLong = completedSessions.value % sessionsPerCycle.value === 0;
      currentMode.value = goLong ? 'LONG_REST' : 'REST';
      playBreakStartSound();
    } else {
      currentMode.value = 'WORK';
      playBreakEndSound();
    }
    resetCurrentSession();
    saveState();
  };

  const tick = () => {
    if (currentSeconds.value > 0) {
      addLiveTimerSecond(currentMode.value);
      currentSeconds.value--;
    } else {
      switchMode();
    }
  };

  const startInterval = () => {
    stopInterval();
    timerInterval = window.setInterval(tick, 1000);
  };

  const startTimer = () => {
    isPaused.value = false;
    isActive.value = true;
    saveState();
    startInterval();
  };

  const pauseTimer = () => {
    stopInterval();
    isActive.value = false;
    isPaused.value = true;
    saveState();
  };

  const toggleTimer = () => {
    if (isActive.value) pauseTimer();
    else startTimer();
  };

  watch(timerStartSignal, () => {
    if (isActive.value) return;

    if (currentMode.value !== 'WORK') {
      currentMode.value = 'WORK';
      resetCurrentSession();
    }

    startTimer();
  });

  const resetTimer = () => {
    stopInterval();
    isActive.value = false;
    isPaused.value = false;
    currentMode.value = 'WORK';
    completedSessions.value = 0;
    resetCurrentSession();
    saveState();
  };

  const skipToNext = () => {
    const wasActive = isActive.value;
    switchMode();
    if (wasActive) startInterval();
  };

  const adjust = (target: TimerMode, delta: number) => {
    const refMap = {
      WORK: { ref: workMinutes, bounds: WORK_BOUNDS },
      REST: { ref: restMinutes, bounds: REST_BOUNDS },
      LONG_REST: { ref: longRestMinutes, bounds: LONG_REST_BOUNDS },
    };
    const { ref: ref$, bounds } = refMap[target];
    const next = ref$.value + delta;
    if (next < bounds.min || next > bounds.max) return;
    ref$.value = next;
    if (!isActive.value && currentMode.value === target) {
      resetCurrentSession();
    }
  };

  const incrementWork = () => adjust('WORK', +1);
  const decrementWork = () => adjust('WORK', -1);
  const incrementRest = () => adjust('REST', +1);
  const decrementRest = () => adjust('REST', -1);
  const incrementLongRest = () => adjust('LONG_REST', +1);
  const decrementLongRest = () => adjust('LONG_REST', -1);

  if (isActive.value && currentSeconds.value > 0) {
    startInterval();
  }

  watch(
    [workMinutes, restMinutes, longRestMinutes, completedSessions, currentMode, isActive],
    saveState,
    { deep: true }
  );

  const formatTime = computed(() => {
    const mm = Math.floor(currentSeconds.value / 60).toString().padStart(2, '0');
    const ss = (currentSeconds.value % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  const progress = computed(() => {
    if (totalSeconds.value === 0) return 0;
    return (1 - currentSeconds.value / totalSeconds.value) * 100;
  });

  // 1-indexed position in the current cycle
  const cycleSession = computed(() => {
    const inCycle = completedSessions.value % sessionsPerCycle.value;
    if (currentMode.value === 'WORK') return inCycle + 1;
    // During REST/LONG_REST, show the just-completed session
    return inCycle === 0 ? sessionsPerCycle.value : inCycle;
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', saveState);
  }

  onUnmounted(() => {
    stopInterval();
    window.removeEventListener('beforeunload', saveState);
  });

  return {
    workMinutes,
    restMinutes,
    longRestMinutes,
    sessionsPerCycle,
    currentSeconds,
    totalSeconds,
    isActive,
    isPaused,
    currentMode,
    completedSessions,
    cycleSession,
    formatTime,
    progress,
    toggleTimer,
    resetTimer,
    skipToNext,
    incrementWork,
    decrementWork,
    incrementRest,
    decrementRest,
    incrementLongRest,
    decrementLongRest,
  };
}
