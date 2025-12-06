import { ref, computed, onUnmounted, watch } from 'vue';
import { useTaskPomodoro } from './useTaskPomodoro';

export type TimerMode = 'WORK' | 'REST';

// Звуковые уведомления через Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Мягкий звук для начала перерыва (расслабляющий)
const playBreakStartSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Два мягких тона (аккорд)
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.15);
      osc.stop(now + 1.5);
    });
  } catch (e) {
    console.warn('Не удалось воспроизвести звук', e);
  }
};

// Энергичный звук для окончания перерыва (пробуждающий)
const playBreakEndSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Три восходящих тона
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.5);
    });
  } catch (e) {
    console.warn('Не удалось воспроизвести звук', e);
  }
};

const STORAGE_KEY = 'POMODORO_STATE';

interface PomodoroState {
  workMinutes: number;
  restMinutes: number;
  completedSessions: number;
  mode: TimerMode;
  currentSeconds: number;
  isActive: boolean;
  lastUpdated: number;
}

export function usePomodoro() {
  // Load state from local storage
  const loadState = (): PomodoroState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load pomodoro state', e);
    }
    return null;
  };

  const savedState = loadState();

  // Determine initial values
  const initialWork = savedState?.workMinutes ?? 25;
  const initialRest = savedState?.restMinutes ?? 5;
  const initialMode = savedState?.mode ?? 'WORK';
  const initialSessions = savedState?.completedSessions ?? 0;
  
  // Calculate elapsed time if it was active
  let initialSeconds = 0;
  let initialActive = false;
  
  if (savedState) {
    initialSeconds = savedState.currentSeconds;
    initialActive = savedState.isActive;
    
    if (initialActive && savedState.lastUpdated) {
      const elapsed = Math.floor((Date.now() - savedState.lastUpdated) / 1000);
      if (elapsed > 0) {
        initialSeconds = Math.max(0, initialSeconds - elapsed);
        // If time ran out while closed, we could handle it here (e.g. switch mode),
        // but for simplicity, let's just let it be 0 and let the user see it finished.
        if (initialSeconds === 0) {
           initialActive = false; // It finished in background
        }
      }
    }
  }

  const workMinutes = ref(initialWork);
  const restMinutes = ref(initialRest);
  const currentSeconds = ref(initialSeconds);
  const totalSeconds = ref(0); // Will be set by setupTimer
  const isActive = ref(initialActive);
  const isPaused = ref(savedState ? !initialActive : false); // If it was active, it's not paused. If not, it might be.
  const currentMode = ref<TimerMode>(initialMode);
  const completedSessions = ref(initialSessions);
  
  let timerInterval: number | null = null;

  const saveState = () => {
      try {
        const state: PomodoroState = {
          workMinutes: workMinutes.value,
          restMinutes: restMinutes.value,
          completedSessions: completedSessions.value,
          mode: currentMode.value,
          currentSeconds: currentSeconds.value,
          isActive: isActive.value,
          lastUpdated: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save pomodoro state', e);
      }
  };

  const setupTimer = (forceReset = false) => {
    if (currentMode.value === 'WORK') {
      totalSeconds.value = workMinutes.value * 60;
    } else {
      totalSeconds.value = restMinutes.value * 60;
    }
    
    // Only reset currentSeconds if specifically requested OR if we are invalid (e.g. settings changed significantly),
    // OR if we are initializing and don't have a saved running state.
    // However, for this function, if we call it during init, we want to respect the restored value.
    if (forceReset) {
       currentSeconds.value = totalSeconds.value;
    } else if (currentSeconds.value === 0 && !isActive.value && !isPaused.value) {
       // If 0 and not active/paused, likely a fresh start or finished state we want to reset?
       // Actually, let's simpler: if we just loaded state, we might have set currentSeconds.
       // We should only overwrite if our logic demands it.
       // Let's rely on the caller to pass forceReset=true when needed.
       // But wait, initially `totalSeconds` is 0.
       // If we just loaded `savedState`, `currentSeconds` is set.
       // If `savedState` was null, `currentSeconds` is 0.
       if (!savedState && currentSeconds.value === 0) {
          currentSeconds.value = totalSeconds.value;
       }
    }
  };

  // Initialize
  setupTimer(false);
  
  // If we restored an active state, start the timer immediately
  if (isActive.value && currentSeconds.value > 0) {
     // Need to defer slightly or just call startTimer logic directly (minus the state toggle)
     // Extract interval logic
     timerInterval = setInterval(() => {
       if (currentSeconds.value > 0) {
         currentSeconds.value--;
       } else {
         switchMode();
       }
     }, 1000) as unknown as number;
  }

  // Persist state changes
  watch(
    [workMinutes, restMinutes, completedSessions, currentMode, isActive],
    saveState,
    { deep: true }
  );
  
  const formatTime = computed(() => {
    const minutes = Math.floor(currentSeconds.value / 60).toString().padStart(2, '0');
    const seconds = (currentSeconds.value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const progress = computed(() => {
    if (totalSeconds.value === 0) return 0;
    return (1 - (currentSeconds.value / totalSeconds.value)) * 100;
  });
  
  // Save on page unload to capture exact second
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', saveState);
  }

  const { onWorkSessionComplete: notifyTaskComplete } = useTaskPomodoro();

  const switchMode = () => {
    if (currentMode.value === 'WORK') {
      currentMode.value = 'REST';
      playBreakStartSound(); // Начало перерыва - мягкий звук
      notifyTaskComplete(); // Уведомляем планировщик о завершении сессии
    } else {
      currentMode.value = 'WORK';
      completedSessions.value++;
      playBreakEndSound(); // Конец перерыва - энергичный звук
    }
    setupTimer(true); // Force reset on mode switch
    saveState();
  };

  const startTimer = () => {
    if (isPaused.value) {
      isPaused.value = false;
    }
    
    isActive.value = true;
    saveState();
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      // We don't save inside the interval to avoid thrashing disk IO, 
      // relying on beforeunload and other triggers
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
    saveState();
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
    setupTimer(true); // Force reset
    saveState();
  };

  const skipToNext = () => {
    switchMode();
    // switchMode calls setupTimer(true) and saveState()
    if (isActive.value) { // If it was active, keep it active
      // Logic inside switchMode doesn't stop timer, but our timer wrapper needs restart
      if (timerInterval) clearInterval(timerInterval);
      startTimer();
    }
  };

  const incrementWork = () => {
    if (workMinutes.value < 60) {
      workMinutes.value++;
      if (!isActive.value && currentMode.value === 'WORK') {
        setupTimer(true);
      }
    }
  };

  const decrementWork = () => {
    if (workMinutes.value > 1) {
      workMinutes.value--;
      if (!isActive.value && currentMode.value === 'WORK') {
        setupTimer(true);
      }
    }
  };

  const incrementRest = () => {
    if (restMinutes.value < 30) {
      restMinutes.value++;
      if (!isActive.value && currentMode.value === 'REST') {
        setupTimer(true);
      }
    }
  };

  const decrementRest = () => {
    if (restMinutes.value > 1) {
      restMinutes.value--;
      if (!isActive.value && currentMode.value === 'REST') {
        setupTimer(true);
      }
    }
  };

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    window.removeEventListener('beforeunload', saveState);
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
