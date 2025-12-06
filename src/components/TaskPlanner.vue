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
          <input 
            type="checkbox" 
            v-model="task.completed" 
            class="checkbox"
            @mousedown.stop
          />
          <input 
            type="text" 
            v-model="task.text" 
            class="task-input" 
            :placeholder="t('tasks.new_task_placeholder')"
            @mousedown.stop
          />
          
          <!-- Tomato Estimation -->
          <div class="tomatoes">
            <span 
              v-for="i in 5" 
              :key="i" 
              class="tomato-dot"
              :class="{ filled: i <= task.estimate }"
              @click="task.estimate = i"
              title="Estimate pomodoros"
              @mousedown.stop
            ></span>
          </div>
          
          <button @click="removeTask(task.id)" class="delete-btn" @mousedown.stop>×</button>
        </div>
        
        <!-- Empty line for new task -->
        <div class="line-item new-task" @click="addTask">
          <span class="plus">+</span>
          <span class="placeholder">{{ t('tasks.add') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePersistence } from '../composables/usePersistence';
import { useDraggable } from '../composables/useDraggable';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

interface Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;
}

const tasks = usePersistence<Task[]>('pomodoro_tasks', []);
const { position, onMouseDown, onTouchStart } = useDraggable('planner_pos', 850, 50);

const addTask = () => {
  tasks.value.push({
    id: Date.now().toString(),
    text: '',
    completed: false,
    estimate: 1
  });
};

const removeTask = (id: string) => {
  tasks.value = (tasks.value as Task[]).filter((t: Task) => t.id !== id);
};
</script>

<style scoped>
.notepad {
  width: 320px;
  /* Slightly rotated for natural look applied in inline style */
  font-family: 'Courier New', Courier, monospace;
  position: absolute;
  z-index: 5;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;
}

.notepad:active {
  cursor: grabbing;
  z-index: 150; /* Pop on drag */
}

.paper {
  background-color: #fdfbf7;
  /* Lined Paper Pattern */
  background-image: 
    linear-gradient(90deg, transparent 39px, #ffcccc 39px, #ffcccc 41px, transparent 41px),
    linear-gradient(#e1e1e1 1px, transparent 1px);
  background-size: 100% 100%, 100% 30px;
  background-attachment: local;
  
  padding: 40px 20px 20px 40px; /* Left padding for red line */
  box-shadow: 
    5px 5px 15px rgba(0,0,0,0.2),
    0 0 50px rgba(0,0,0,0.1) inset;
  min-height: 400px;
  border-radius: 2px;
}

/* Torn top edge effect could be added here */

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  border-bottom: 2px solid #555;
  padding-bottom: 5px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.date {
  color: #888;
  font-size: 14px;
}

.lines {
  display: flex;
  flex-direction: column;
}

.line-item {
  display: flex;
  align-items: center;
  height: 30px; /* Matches line height */
  /* align with background lines */
  margin-bottom: 0px; 
}

.checkbox {
  margin-right: 10px;
  cursor: pointer;
}

.task-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 16px;
  color: #333;
  outline: none;
}

.completed .task-input {
  text-decoration: line-through;
  color: #aaa;
}

.tomatoes {
  display: flex;
  gap: 2px;
  margin-left: 5px;
  cursor: pointer;
}

.tomato-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #ff6b6b;
  background: transparent;
}

.tomato-dot.filled {
  background: #ff6b6b;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #cc0000;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  opacity: 0;
  transition: opacity 0.2s;
}

.line-item:hover .delete-btn {
  opacity: 1;
}

.new-task {
  color: #888;
  cursor: pointer;
  opacity: 0.7;
}

.new-task:hover {
  opacity: 1;
  background: rgba(0,0,0,0.02);
}

.plus {
  margin-right: 10px;
  font-weight: bold;
}
</style>
