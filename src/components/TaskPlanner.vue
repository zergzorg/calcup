<template>
  <div 
    class="notepad"
    :style="{ transform: `translate(${position.x}px, ${position.y}px) rotate(-2deg)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="paper">
      <div class="header">
        <h2>{{ t('tasks.title') }}</h2>
        <div class="date">{{ new Date().toLocaleDateString(locale) }}</div>
      </div>
      
      <div class="lines">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="line-item"
          :class="{ completed: task.completed }"
        >
          <!-- Чекбокс за линейкой -->
          <div class="checkbox-area">
            <input 
              type="checkbox" 
              v-model="task.completed" 
              class="checkbox"
              @mousedown.stop
            />
          </div>
          
          <!-- Основной контент -->
          <div class="task-content">
            <textarea 
              v-model="task.text" 
              class="task-input" 
              :placeholder="t('tasks.new_task_placeholder')"
              @mousedown.stop
              rows="1"
              @input="autoResize($event)"
            ></textarea>
            
            <!-- Помидоры оценки -->
            <div class="tomatoes" v-if="!task.completed">
              <span 
                v-for="i in 5" 
                :key="i" 
                class="tomato"
                :class="{ filled: i <= task.estimate }"
                @click="task.estimate = i"
                @mousedown.stop
                :title="`${i} ${i === 1 ? 'помидор' : 'помидоров'}`"
              >🍅</span>
            </div>
            
            <!-- Показать оценку для завершённых -->
            <span v-if="task.completed && task.estimate" class="completed-badge">
              {{ task.estimate }} 🍅
            </span>
          </div>
          
          <button @click="removeTask(task.id)" class="delete-btn" @mousedown.stop>×</button>
        </div>
        
        <!-- Добавить задачу -->
        <div class="line-item new-task" @click="addTask">
          <div class="checkbox-area">
            <span class="plus">+</span>
          </div>
          <div class="task-content">
            <span class="placeholder">{{ t('tasks.add') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '../composables/useDraggable';
import { usePersistence } from '../composables/usePersistence';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const { position, onMouseDown, onTouchStart } = useDraggable('planner_pos', 850, 50);

interface Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;
}

const tasks = usePersistence<Task[]>('planner_tasks', []);

const addTask = () => {
  tasks.value.push({
    id: Date.now().toString(),
    text: '',
    completed: false,
    estimate: 1
  });
};

const removeTask = (id: string) => {
  tasks.value = tasks.value.filter((task: Task) => task.id !== id);
};

// Автоматическое изменение высоты textarea
const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};
</script>

<style scoped>
/* === КОЖАНЫЙ ЕЖЕДНЕВНИК === */
.notepad {
  width: 340px;
  font-family: 'Georgia', 'Times New Roman', serif;
  position: absolute;
  z-index: 5;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;
  
  /* Кожаная обложка */
  background: 
    /* Текстура кожи */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    linear-gradient(145deg, #5a3d2b, #4a3020);
  padding: 12px;
  border-radius: 4px;
  
  /* Объёмная тень */
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* Эффект прошивки */
.notepad::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  pointer-events: none;
}

.notepad:active {
  cursor: grabbing;
  z-index: 150;
  box-shadow: 
    0 20px 45px rgba(0, 0, 0, 0.5),
    0 10px 20px rgba(0, 0, 0, 0.4);
}

/* === БУМАГА === */
.paper {
  background-color: #faf8f0;
  background-image: 
    /* Красная вертикальная линия слева */
    linear-gradient(90deg, 
      transparent 38px, 
      #e8b4b4 38px, 
      #e8b4b4 40px, 
      transparent 40px),
    /* Горизонтальные линии */
    linear-gradient(#d4d0c8 1px, transparent 1px);
  background-size: 100% 100%, 100% 28px;
  background-position: 0 0, 0 0;
  
  padding: 20px 16px 20px 48px;
  min-height: 380px;
  border-radius: 2px;
  position: relative;
  overflow: hidden; /* FIX: помидоры не выходят за границу */
  
  /* Эффект бумаги */
  box-shadow: 
    inset 0 0 30px rgba(0, 0, 0, 0.05),
    inset -2px 0 5px rgba(0, 0, 0, 0.05);
}

/* Загнутый уголок */
.paper::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: 
    linear-gradient(135deg, 
      #faf8f0 50%, 
      transparent 50%),
    linear-gradient(135deg, 
      transparent 50%, 
      #d4c9a8 50%);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
}

/* === ЗАГОЛОВОК === */
.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: none;
  position: relative;
}

/* Эффект маркера под заголовком */
.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, 
    rgba(255, 230, 150, 0.6) 0%, 
    rgba(255, 230, 150, 0.3) 80%,
    transparent 100%);
  border-radius: 2px;
}

h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #2c1810;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.date {
  color: #8b7355;
  font-size: 13px;
  font-style: italic;
  position: relative;
  z-index: 1;
}

/* === СПИСОК ЗАДАЧ === */
.lines {
  display: flex;
  flex-direction: column;
  margin-left: -32px; /* Сдвигаем влево чтобы чекбоксы были за красной линией */
}

.line-item {
  display: flex;
  align-items: flex-start;
  min-height: 28px;
  padding: 2px 0;
  transition: all 0.2s;
}

.line-item:hover {
  background: rgba(255, 248, 220, 0.3);
}

/* === ЗОНА ЧЕКБОКСА (за линейкой) === */
.checkbox-area {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* === КАСТОМНЫЙ ЧЕКБОКС === */
.checkbox {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #c9b896;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  background: transparent;
  transition: all 0.2s;
}

.checkbox:hover {
  border-color: #8b7355;
}

.checkbox:checked {
  background: #5a9a5a;
  border-color: #4a8a4a;
}

/* Галочка */
.checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}

/* === КОНТЕНТ ЗАДАЧИ === */
.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

/* === ПОЛЕ ВВОДА (textarea) === */
.task-input {
  width: 100%;
  background: transparent;
  border: none;
  font-family: 'Georgia', serif;
  font-size: 15px;
  color: #2c1810;
  outline: none;
  padding: 2px 4px;
  resize: none;
  overflow: hidden;
  min-height: 20px;
  line-height: 1.4;
}

.task-input::placeholder {
  color: #b8a88a;
  font-style: italic;
}

.completed .task-input {
  text-decoration: line-through;
  color: #a89880;
}

/* === ПОМИДОРЫ ОЦЕНКИ === */
.tomatoes {
  display: flex;
  gap: 2px;
  padding-left: 4px;
}

.tomato {
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  opacity: 0.3;
  filter: grayscale(100%);
}

.tomato:hover {
  transform: scale(1.2);
  opacity: 0.6;
  filter: grayscale(50%);
}

.tomato.filled {
  opacity: 1;
  filter: none;
}

/* === БЕЙДЖ ДЛЯ ЗАВЕРШЁННЫХ === */
.completed-badge {
  font-size: 11px;
  color: #8b7355;
  padding-left: 4px;
}

/* === КНОПКА УДАЛЕНИЯ === */
.delete-btn {
  background: transparent;
  border: none;
  color: #c0392b;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
  opacity: 0;
  transition: all 0.2s;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(192, 57, 43, 0.1);
}

.line-item:hover .delete-btn {
  opacity: 1;
}

/* === ДОБАВИТЬ ЗАДАЧУ === */
.new-task {
  color: #8b7355;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s;
}

.new-task:hover {
  opacity: 1;
}

.plus {
  font-size: 14px;
  font-weight: bold;
  color: #8b7355;
}

.placeholder {
  font-style: italic;
  font-size: 14px;
  padding-left: 4px;
}
</style>
