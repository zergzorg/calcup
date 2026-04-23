import { ref, watch } from 'vue';

const STORAGE_KEY = 'TASK_POMODORO_STATE';
const LEGACY_LOCAL_KEY = 'pomodoro_tasks';
const LEGACY_COOKIE_KEY = 'planner_tasks';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;
  spent: number;
}

interface TaskPomodoroState {
  activeTaskId: string | null;
  tasks: Task[];
}

const activeTaskId = ref<string | null>(null);
const tasks = ref<Task[]>([]);
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
});

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as TaskPomodoroState;
      activeTaskId.value = state.activeTaskId;
      tasks.value = state.tasks.map(normalizeTask);
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
      tasks: tasks.value,
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
    watch([activeTaskId, tasks], saveState, { deep: true });
  }

  const startTask = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task && !task.completed) activeTaskId.value = taskId;
  };

  const stopTask = () => {
    activeTaskId.value = null;
  };

  const toggleActiveTask = (taskId: string) => {
    if (activeTaskId.value === taskId) stopTask();
    else startTask(taskId);
  };

  const onWorkSessionComplete = () => {
    if (!activeTaskId.value) return;
    const task = tasks.value.find((t) => t.id === activeTaskId.value);
    if (!task || task.completed) return;

    task.spent = (task.spent || 0) + 1;
    if (task.spent >= task.estimate) {
      task.completed = true;
      activeTaskId.value = null;
    }
  };

  const finishTask = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    task.completed = true;
    if (activeTaskId.value === taskId) activeTaskId.value = null;
  };

  const addTask = () => {
    tasks.value.push({
      id: Date.now().toString(),
      text: '',
      completed: false,
      estimate: 1,
      spent: 0,
    });
  };

  const removeTask = (taskId: string) => {
    if (activeTaskId.value === taskId) activeTaskId.value = null;
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  };

  const reopenTask = (taskId: string) => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) task.completed = false;
  };

  return {
    tasks,
    activeTaskId,
    startTask,
    stopTask,
    toggleActiveTask,
    onWorkSessionComplete,
    finishTask,
    addTask,
    removeTask,
    reopenTask,
  };
}
