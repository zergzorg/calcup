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
          :class="{ completed: task.completed, active: activeTaskId === task.id }"
        >
          <div class="checkbox-area">
            <input
              type="checkbox"
              v-model="task.completed"
              class="checkbox"
              @mousedown.stop
            />
          </div>

          <div class="task-content">
            <div class="task-row">
              <textarea
                v-model="task.text"
                class="task-input"
                :placeholder="t('tasks.new_task_placeholder')"
                @mousedown.stop
                rows="1"
                @input="autoResize($event)"
              ></textarea>

              <button
                v-if="!task.completed"
                class="play-btn"
                :class="{ on: activeTaskId === task.id }"
                :title="activeTaskId === task.id ? t('tasks.stop') : t('tasks.start')"
                @click="toggleActiveTask(task.id)"
                @mousedown.stop
              >
                {{ activeTaskId === task.id ? '◼' : '▶' }}
              </button>
            </div>

            <div class="tomatoes" v-if="!task.completed">
              <span
                v-for="i in Math.max(task.estimate, task.spent)"
                :key="i"
                class="tomato"
                :class="{ filled: i <= task.spent, ghost: i > task.estimate }"
                @click="setEstimate(task, i)"
                @mousedown.stop
                :title="`${task.spent}/${task.estimate} 🍅`"
              >🍅</span>
              <span
                v-if="task.estimate < 5"
                class="tomato add"
                @click="setEstimate(task, task.estimate + 1)"
                @mousedown.stop
                title="+1"
              >+</span>
            </div>

            <span v-if="task.completed && task.estimate" class="completed-badge">
              {{ task.spent }}/{{ task.estimate }} 🍅
            </span>
          </div>

          <button @click="removeTask(task.id)" class="delete-btn" @mousedown.stop>×</button>
        </div>

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
import { useTaskPomodoro, type Task } from '../composables/useTaskPomodoro';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const { position, onMouseDown, onTouchStart } = useDraggable('planner_pos', 850, 50);
const {
  tasks,
  activeTaskId,
  addTask,
  removeTask,
  toggleActiveTask,
} = useTaskPomodoro();

const setEstimate = (task: Task, value: number) => {
  task.estimate = Math.max(1, Math.min(value, 9));
};

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};
</script>

<style scoped>
/* Leather journal */
.notepad {
  width: 340px;
  font-family: 'Georgia', 'Times New Roman', serif;
  position: absolute;
  z-index: 5;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;

  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    linear-gradient(145deg, #5a3d2b, #4a3020);
  padding: 12px;
  border-radius: 4px;

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.notepad::before {
  content: '';
  position: absolute;
  inset: 8px;
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

.paper {
  background-color: #faf8f0;
  background-image:
    linear-gradient(90deg,
      transparent 38px,
      #e8b4b4 38px,
      #e8b4b4 40px,
      transparent 40px),
    linear-gradient(#d4d0c8 1px, transparent 1px);
  background-size: 100% 100%, 100% 28px;
  background-position: 0 0, 0 0;

  padding: 20px 16px 20px 48px;
  min-height: 380px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;

  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.05),
    inset -2px 0 5px rgba(0, 0, 0, 0.05);
}

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

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  padding-bottom: 8px;
  position: relative;
}

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

.lines {
  display: flex;
  flex-direction: column;
  margin-left: -32px;
}

.line-item {
  display: flex;
  align-items: flex-start;
  min-height: 28px;
  padding: 2px 0;
  transition: all 0.2s;
  position: relative;
}

.line-item:hover {
  background: rgba(255, 248, 220, 0.3);
}

.line-item.active {
  background: rgba(255, 230, 150, 0.45);
  box-shadow: inset 3px 0 0 #d4843a;
}

.checkbox-area {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding-top: 4px;
}

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

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.task-input {
  flex: 1;
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

.play-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #8b7355;
  font-size: 11px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.2s;
}

.line-item:hover .play-btn,
.play-btn.on {
  opacity: 1;
}

.play-btn:hover {
  background: rgba(212, 132, 58, 0.15);
  border-color: #d4843a;
  color: #d4843a;
}

.play-btn.on {
  background: #d4843a;
  border-color: #b06a28;
  color: #fff;
  font-size: 9px;
  box-shadow: 0 0 8px rgba(212, 132, 58, 0.4);
}

.tomatoes {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-left: 4px;
  flex-wrap: wrap;
}

.tomato {
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s, filter 0.15s;
  opacity: 0.35;
  filter: grayscale(100%);
  user-select: none;
}

.tomato:hover {
  transform: scale(1.2);
  opacity: 0.7;
  filter: grayscale(40%);
}

.tomato.filled {
  opacity: 1;
  filter: none;
}

.tomato.ghost {
  opacity: 0.18;
}

.tomato.add {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  color: #8b7355;
  background: rgba(139, 115, 85, 0.1);
  filter: none;
  opacity: 0.5;
}

.tomato.add:hover {
  background: rgba(139, 115, 85, 0.25);
  opacity: 1;
}

.completed-badge {
  font-size: 11px;
  color: #8b7355;
  padding-left: 4px;
}

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
