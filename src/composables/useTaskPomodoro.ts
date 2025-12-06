import { ref, watch } from 'vue';

const STORAGE_KEY = 'TASK_POMODORO_STATE';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;  // Оценка помидоров
  spent: number;     // Потрачено помидоров
}

interface TaskPomodoroState {
  activeTaskId: string | null;
  tasks: Task[];
}

// Синглтон состояния для использования между компонентами
const activeTaskId = ref<string | null>(null);
const tasks = ref<Task[]>([]);
let isInitialized = false;

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state: TaskPomodoroState = JSON.parse(stored);
      activeTaskId.value = state.activeTaskId;
      tasks.value = state.tasks.map(t => ({
        ...t,
        spent: t.spent ?? 0  // Миграция старых данных
      }));
    } else {
      // Попробуем загрузить старые задачи
      const oldTasks = localStorage.getItem('pomodoro_tasks');
      if (oldTasks) {
        const parsed = JSON.parse(oldTasks);
        tasks.value = parsed.map((t: any) => ({
          ...t,
          spent: t.spent ?? 0
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load task pomodoro state', e);
  }
};

const saveState = () => {
  try {
    const state: TaskPomodoroState = {
      activeTaskId: activeTaskId.value,
      tasks: tasks.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save task pomodoro state', e);
  }
};

export function useTaskPomodoro() {
  // Инициализируем только один раз
  if (!isInitialized) {
    loadState();
    isInitialized = true;
    
    // Автосохранение при изменениях
    watch([activeTaskId, tasks], saveState, { deep: true });
  }

  // Начать работу над задачей
  const startTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task && !task.completed) {
      activeTaskId.value = taskId;
    }
  };

  // Остановить работу (без завершения)
  const stopTask = () => {
    activeTaskId.value = null;
  };

  // Вызывается при завершении рабочей сессии Pomodoro
  const onWorkSessionComplete = () => {
    if (!activeTaskId.value) return;
    
    const task = tasks.value.find(t => t.id === activeTaskId.value);
    if (!task || task.completed) return;
    
    // Добавляем потраченный помидор
    task.spent = (task.spent || 0) + 1;
    
    // Проверяем, достигли ли оценки
    if (task.spent >= task.estimate) {
      task.completed = true;
      activeTaskId.value = null;
    }
    
    saveState();
  };

  // Завершить задачу вручную
  const finishTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
      if (activeTaskId.value === taskId) {
        activeTaskId.value = null;
      }
      saveState();
    }
  };

  // Добавить новую задачу
  const addTask = () => {
    tasks.value.push({
      id: Date.now().toString(),
      text: '',
      completed: false,
      estimate: 1,
      spent: 0
    });
  };

  // Удалить задачу
  const removeTask = (taskId: string) => {
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null;
    }
    tasks.value = tasks.value.filter(t => t.id !== taskId);
  };

  // Возобновить задачу (снять отметку о выполнении)
  const reopenTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.completed = false;
    }
  };

  return {
    tasks,
    activeTaskId,
    startTask,
    stopTask,
    onWorkSessionComplete,
    finishTask,
    addTask,
    removeTask,
    reopenTask
  };
}
