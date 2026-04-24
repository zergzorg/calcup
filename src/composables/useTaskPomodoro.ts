import { computed, ref, watch } from 'vue';
import type { TimerMode } from './usePomodoro';

const STORAGE_KEY = 'TASK_POMODORO_STATE';
const LEGACY_LOCAL_KEY = 'pomodoro_tasks';
const LEGACY_COOKIE_KEY = 'planner_tasks';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;
  spent: number;
  focusSeconds: number;
  breakSeconds: number;
  createdAt: number;
  completedAt: number | null;
}

export interface TaskSegment {
  id: string;
  taskId: string;
  mode: TimerMode;
  startedAt: number;
  endedAt: number;
  plannedSeconds: number;
  actualSeconds: number;
  completed: boolean;
}

interface TaskPomodoroState {
  activeTaskId: string | null;
  lastFocusTaskId: string | null;
  tasks: Task[];
  segments: TaskSegment[];
}

const activeTaskId = ref<string | null>(null);
const lastFocusTaskId = ref<string | null>(null);
const tasks = ref<Task[]>([]);
const segments = ref<TaskSegment[]>([]);
const timerStartSignal = ref(0);
const liveTodayFocusSeconds = ref(0);
const liveTodayBreakSeconds = ref(0);
let isInitialized = false;

const readCookie = (key: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const clearCookie = (key: string): void => {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const normalizeTask = (raw: Partial<Task>): Task => ({
  id: raw.id ?? Date.now().toString(),
  text: raw.text ?? '',
  completed: raw.completed ?? false,
  estimate: raw.estimate ?? 1,
  spent: raw.spent ?? 0,
  focusSeconds: raw.focusSeconds ?? Math.max(0, raw.spent ?? 0) * 25 * 60,
  breakSeconds: raw.breakSeconds ?? 0,
  createdAt: raw.createdAt ?? Date.now(),
  completedAt: raw.completedAt ?? (raw.completed ? Date.now() : null),
});

const normalizeSegment = (raw: Partial<TaskSegment>): TaskSegment | null => {
  if (!raw.taskId || !raw.mode) return null;

  return {
    id: raw.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    taskId: raw.taskId,
    mode: raw.mode,
    startedAt: raw.startedAt ?? Date.now(),
    endedAt: raw.endedAt ?? Date.now(),
    plannedSeconds: raw.plannedSeconds ?? 0,
    actualSeconds: raw.actualSeconds ?? 0,
    completed: raw.completed ?? false,
  };
};

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as TaskPomodoroState;
      activeTaskId.value = state.activeTaskId;
      lastFocusTaskId.value = state.lastFocusTaskId ?? null;
      tasks.value = state.tasks.map(normalizeTask);
      segments.value = (state.segments ?? [])
        .map(normalizeSegment)
        .filter((segment): segment is TaskSegment => Boolean(segment));
      return;
    }

    const legacyLocal = localStorage.getItem(LEGACY_LOCAL_KEY);
    if (legacyLocal) {
      tasks.value = (JSON.parse(legacyLocal) as Partial<Task>[]).map(normalizeTask);
      return;
    }

    const legacyCookie = readCookie(LEGACY_COOKIE_KEY);
    if (legacyCookie) {
      tasks.value = (JSON.parse(legacyCookie) as Partial<Task>[]).map(normalizeTask);
      clearCookie(LEGACY_COOKIE_KEY);
    }
  } catch (e) {
    console.warn('Failed to load task pomodoro state', e);
  }
};

const saveState = () => {
  try {
    const state: TaskPomodoroState = {
      activeTaskId: activeTaskId.value,
      lastFocusTaskId: lastFocusTaskId.value,
      tasks: tasks.value,
      segments: segments.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save task pomodoro state', e);
  }
};

export function useTaskPomodoro() {
  if (!isInitialized) {
    loadState();
    isInitialized = true;
    watch([activeTaskId, lastFocusTaskId, tasks, segments], saveState, { deep: true });
  }

  const activeTask = computed(() => tasks.value.find((task) => task.id === activeTaskId.value) ?? null);
  const lastFocusTask = computed(() => tasks.value.find((task) => task.id === lastFocusTaskId.value) ?? null);

  const todayStart = computed(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const todaySegments = computed(() => segments.value.filter((segment) => segment.startedAt >= todayStart.value));
  const todayFocusSeconds = computed(() =>
    todaySegments.value
      .filter((segment) => segment.mode === 'WORK')
      .reduce((total, segment) => total + segment.actualSeconds, 0) + liveTodayFocusSeconds.value
  );
  const todayBreakSeconds = computed(() =>
    todaySegments.value
      .filter((segment) => segment.mode !== 'WORK')
      .reduce((total, segment) => total + segment.actualSeconds, 0) + liveTodayBreakSeconds.value
  );
  const todayCompletedFocusSessions = computed(() =>
    todaySegments.value.filter((segment) => segment.mode === 'WORK' && segment.completed).length
  );

  const startTask = (taskId: string, shouldStartTimer = false) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    if (task.completed) {
      task.completed = false;
      task.completedAt = null;
    }
    activeTaskId.value = taskId;
    if (shouldStartTimer) timerStartSignal.value++;
  };

  const stopTask = () => {
    activeTaskId.value = null;
  };

  const toggleActiveTask = (taskId: string, shouldStartTimer = false) => {
    if (activeTaskId.value === taskId) stopTask();
    else startTask(taskId, shouldStartTimer);
  };

  const addLiveTimerSecond = (mode: TimerMode) => {
    const taskId = mode === 'WORK' ? activeTaskId.value : lastFocusTaskId.value;
    if (!taskId) return;

    const task = tasks.value.find((t) => t.id === taskId);
    if (!task || (mode === 'WORK' && task.completed)) return;

    if (mode === 'WORK') {
      task.focusSeconds = (task.focusSeconds || 0) + 1;
      lastFocusTaskId.value = task.id;
      liveTodayFocusSeconds.value++;
    } else {
      task.breakSeconds = (task.breakSeconds || 0) + 1;
      liveTodayBreakSeconds.value++;
    }
  };

  const clearLiveTimerSeconds = (mode: TimerMode, actualSeconds: number) => {
    if (mode === 'WORK') {
      liveTodayFocusSeconds.value = Math.max(0, liveTodayFocusSeconds.value - actualSeconds);
    } else {
      liveTodayBreakSeconds.value = Math.max(0, liveTodayBreakSeconds.value - actualSeconds);
    }
  };

  const recordTimerSegment = (
    mode: TimerMode,
    plannedSeconds: number,
    actualSeconds: number,
    completed: boolean
  ) => {
    const taskId = mode === 'WORK' ? activeTaskId.value : lastFocusTaskId.value;
    if (!taskId || actualSeconds <= 0) return;

    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;

    const now = Date.now();
    clearLiveTimerSeconds(mode, actualSeconds);

    segments.value.unshift({
      id: `${now}-${mode}-${taskId}`,
      taskId,
      mode,
      startedAt: now - actualSeconds * 1000,
      endedAt: now,
      plannedSeconds,
      actualSeconds,
      completed,
    });

    if (mode === 'WORK') {
      lastFocusTaskId.value = task.id;

      if (completed) {
        task.spent = (task.spent || 0) + 1;
        if (task.spent >= task.estimate) {
          task.completed = true;
          task.completedAt = now;
          activeTaskId.value = null;
        }
      }
    }
  };

  const finishTask = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    task.completed = true;
    task.completedAt = Date.now();
    if (activeTaskId.value === taskId) activeTaskId.value = null;
  };

  const setTaskCompleted = (taskId: string, completed: boolean) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    task.completed = completed;
    task.completedAt = completed ? Date.now() : null;
    if (completed && activeTaskId.value === taskId) activeTaskId.value = null;
  };

  const addTask = () => {
    const id = Date.now().toString();
    tasks.value.unshift({
      id,
      text: '',
      completed: false,
      estimate: 1,
      spent: 0,
      focusSeconds: 0,
      breakSeconds: 0,
      createdAt: Date.now(),
      completedAt: null,
    });
    activeTaskId.value = id;
  };

  const removeTask = (taskId: string) => {
    if (activeTaskId.value === taskId) activeTaskId.value = null;
    if (lastFocusTaskId.value === taskId) lastFocusTaskId.value = null;
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    segments.value = segments.value.filter((segment) => segment.taskId !== taskId);
  };

  const reopenTask = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    task.completed = false;
    task.completedAt = null;
  };

  return {
    tasks,
    segments,
    activeTaskId,
    activeTask,
    lastFocusTask,
    timerStartSignal,
    todayFocusSeconds,
    todayBreakSeconds,
    todayCompletedFocusSessions,
    startTask,
    stopTask,
    toggleActiveTask,
    addLiveTimerSecond,
    recordTimerSegment,
    finishTask,
    setTaskCompleted,
    addTask,
    removeTask,
    reopenTask,
  };
}
