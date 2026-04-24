<template>
  <div
    class="planner"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex }"
    @mousedown.capture="activateWidget"
    @touchstart.capture="activateWidget"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="planner-shell">
      <header class="planner-header">
        <div>
          <p class="eyebrow">{{ todayLabel }}</p>
          <h2>{{ t('tasks.title') }}</h2>
        </div>
        <button class="add-btn" :title="t('tasks.add')" @click="addTask" @mousedown.stop>
          +
        </button>
      </header>

      <div class="planner-stats" @mousedown.stop>
        <div class="stat">
          <span>{{ t('tasks.stats.focus') }}</span>
          <strong>{{ formatDuration(todayFocusSeconds) }}</strong>
        </div>
        <div class="stat">
          <span>{{ t('tasks.stats.breaks') }}</span>
          <strong>{{ formatDuration(todayBreakSeconds) }}</strong>
        </div>
        <div class="stat">
          <span>{{ t('tasks.stats.sessions') }}</span>
          <strong>{{ todayCompletedFocusSessions }}</strong>
        </div>
      </div>

      <div class="active-strip" :class="{ empty: !activeTask }" @mousedown.stop>
        <span class="active-dot"></span>
        <span class="active-text">{{ activeTask?.text || t('tasks.no_active') }}</span>
      </div>

      <div class="task-list">
        <article
          v-for="task in orderedTasks"
          :key="task.id"
          class="task-card"
          :class="{ completed: task.completed, active: activeTaskId === task.id }"
          @mousedown.stop
        >
          <label class="task-check">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="(event) => setTaskCompleted(task.id, (event.target as HTMLInputElement).checked)"
            />
            <span></span>
          </label>

          <div class="task-main">
            <div class="task-topline">
              <textarea
                v-model="task.text"
                class="task-input"
                :placeholder="t('tasks.new_task_placeholder')"
                rows="1"
                @input="autoResize($event)"
              ></textarea>

              <button
                v-if="!task.completed"
                class="focus-btn"
                :class="{ active: activeTaskId === task.id }"
                :title="activeTaskId === task.id ? t('tasks.stop') : t('tasks.start')"
                @click="toggleActiveTask(task.id, true)"
              >
                <span v-if="activeTaskId === task.id">■</span>
                <span v-else>▶</span>
              </button>
            </div>

            <div class="progress-row">
              <div class="progress-track">
                <span :style="{ width: `${taskProgress(task)}%` }"></span>
              </div>
              <span class="progress-label">{{ task.spent }}/{{ task.estimate }}</span>
            </div>

            <div class="task-meta">
              <span>{{ t('tasks.focus_time') }} {{ formatDuration(task.focusSeconds) }}</span>
              <span>{{ t('tasks.break_time') }} {{ formatDuration(task.breakSeconds) }}</span>
            </div>

            <div v-if="!task.completed" class="estimate-row">
              <button
                v-for="value in estimateOptions"
                :key="value"
                class="estimate-dot"
                :class="{ filled: value <= task.spent, planned: value <= task.estimate }"
                :title="`${value} ${t('tasks.sessions_short')}`"
                @click="setEstimate(task, value)"
              ></button>
            </div>
          </div>

          <button class="delete-btn" :title="t('tasks.delete')" @click="removeTask(task.id)">×</button>
        </article>

        <button class="new-task-card" @click="addTask" @mousedown.stop>
          <span>+</span>
          {{ t('tasks.add') }}
        </button>
      </div>

      <footer v-if="recentSegments.length" class="timeline" @mousedown.stop>
        <h3>{{ t('tasks.timeline') }}</h3>
        <div class="segment-list">
          <div v-for="segment in recentSegments" :key="segment.id" class="segment">
            <span class="segment-mode" :class="segment.mode.toLowerCase()">{{ segmentLabel(segment.mode) }}</span>
            <span class="segment-task">{{ taskTitle(segment.taskId) }}</span>
            <span class="segment-time">{{ formatDuration(segment.actualSeconds) }}</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDraggable } from '../composables/useDraggable';
import { useTaskPomodoro, type Task } from '../composables/useTaskPomodoro';
import type { TimerMode } from '../composables/usePomodoro';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const { position, zIndex, activateWidget, onMouseDown, onTouchStart } = useDraggable('planner_pos', 850, 50);
const {
  tasks,
  segments,
  activeTaskId,
  activeTask,
  todayFocusSeconds,
  todayBreakSeconds,
  todayCompletedFocusSessions,
  addTask,
  removeTask,
  toggleActiveTask,
  setTaskCompleted,
} = useTaskPomodoro();

const estimateOptions = [1, 2, 3, 4, 5, 6];
const todayLabel = computed(() => new Date().toLocaleDateString(locale.value, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
}));

const orderedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (a.id === activeTaskId.value) return -1;
    if (b.id === activeTaskId.value) return 1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
});

const recentSegments = computed(() => segments.value.slice(0, 4));

const setEstimate = (task: Task, value: number) => {
  task.estimate = Math.max(Math.max(1, task.spent), Math.min(value, 9));
};

const taskProgress = (task: Task) => {
  if (!task.estimate) return 0;
  return Math.min(100, Math.round((task.spent / task.estimate) * 100));
};

const formatDuration = (seconds: number) => {
  if (!seconds) return '0с';
  if (seconds < 60) return `${seconds}с`;

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (!hours) return `${minutes}м`;
  if (!restMinutes) return `${hours}ч`;
  return `${hours}ч ${restMinutes}м`;
};

const taskTitle = (taskId: string) => {
  const task = tasks.value.find((item) => item.id === taskId);
  return task?.text || t('tasks.untitled');
};

const segmentLabel = (mode: TimerMode) => {
  if (mode === 'WORK') return t('tasks.segment_focus');
  if (mode === 'REST') return t('tasks.segment_break');
  return t('tasks.segment_long_break');
};

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};
</script>

<style scoped>
.planner {
  width: 390px;
  position: absolute;
  z-index: 5;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;
}

.planner:active {
  cursor: grabbing;
  z-index: 150;
}

.planner-shell {
  overflow: hidden;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 253, 247, 0.98), rgba(244, 239, 229, 0.96)),
    linear-gradient(90deg, rgba(219, 96, 80, 0.22) 1px, transparent 1px),
    linear-gradient(rgba(45, 54, 67, 0.08) 1px, transparent 1px);
  background-size: auto, 52px 100%, 100% 32px;
  box-shadow:
    0 24px 55px rgba(0, 0, 0, 0.28),
    0 8px 18px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.planner-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.eyebrow {
  margin: 0 0 3px;
  color: #8b7a62;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #241f1a;
  font-family: 'SF Pro Display', 'Inter', system-ui, sans-serif;
  font-size: 24px;
  font-weight: 760;
  line-height: 1.05;
}

.add-btn,
.focus-btn,
.delete-btn,
.new-task-card {
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
}

.add-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(51, 43, 32, 0.12);
  border-radius: 8px;
  background: #29221c;
  color: #fff8ec;
  font-size: 22px;
  line-height: 1;
  box-shadow: 0 8px 18px rgba(41, 34, 28, 0.16);
}

.planner-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.stat {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid rgba(51, 43, 32, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.46);
}

.stat span {
  display: block;
  color: #8b7a62;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.stat strong {
  display: block;
  margin-top: 2px;
  color: #29221c;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.active-strip {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 34px;
  margin-bottom: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(232, 93, 77, 0.1);
  color: #5a332c;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
}

.active-strip.empty {
  background: rgba(41, 34, 28, 0.06);
  color: #8b7a62;
}

.active-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #e85d4d;
  box-shadow: 0 0 0 4px rgba(232, 93, 77, 0.13);
}

.active-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-strip.empty .active-dot {
  background: #aa9c86;
  box-shadow: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-height: 395px;
  overflow-y: auto;
  padding-right: 2px;
}

.task-card {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 24px;
  gap: 10px;
  padding: 12px 10px;
  border: 1px solid rgba(51, 43, 32, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.task-card:hover,
.task-card.active {
  border-color: rgba(232, 93, 77, 0.34);
  background: rgba(255, 255, 255, 0.82);
}

.task-card.active {
  box-shadow: inset 3px 0 0 #e85d4d, inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.task-card.completed {
  opacity: 0.58;
}

.task-check {
  padding-top: 3px;
}

.task-check input {
  position: absolute;
  opacity: 0;
}

.task-check span {
  width: 18px;
  height: 18px;
  display: block;
  border: 1px solid rgba(41, 34, 28, 0.24);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
}

.task-check input:checked + span {
  background: #62b36f;
  border-color: #4d9f5b;
}

.task-check input:checked + span::after {
  content: '';
  display: block;
  width: 9px;
  height: 5px;
  margin: 4px auto 0;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg);
}

.task-main {
  min-width: 0;
}

.task-topline {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.task-input {
  flex: 1;
  min-height: 22px;
  padding: 0;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: #2a2119;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.35;
}

.task-input::placeholder {
  color: #aa9c86;
}

.completed .task-input {
  color: #7f735f;
  text-decoration: line-through;
}

.focus-btn {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid rgba(232, 93, 77, 0.2);
  border-radius: 999px;
  background: rgba(232, 93, 77, 0.08);
  color: #c64637;
  font-size: 10px;
}

.focus-btn.active {
  background: #e85d4d;
  color: #fff;
  box-shadow: 0 8px 18px rgba(232, 93, 77, 0.22);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
}

.progress-track {
  height: 6px;
  flex: 1;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(41, 34, 28, 0.1);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e85d4d, #d98b52);
  transition: width 0.25s ease;
}

.progress-label {
  color: #7d6c55;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 7px;
  color: #8b7a62;
  font-size: 11px;
  font-weight: 700;
}

.estimate-row {
  display: flex;
  gap: 5px;
  margin-top: 9px;
}

.estimate-dot {
  width: 17px;
  height: 17px;
  padding: 0;
  border: 1px solid rgba(41, 34, 28, 0.13);
  border-radius: 50%;
  background: rgba(41, 34, 28, 0.08);
}

.estimate-dot.planned {
  background: rgba(232, 93, 77, 0.18);
  border-color: rgba(232, 93, 77, 0.28);
}

.estimate-dot.filled {
  background: #e85d4d;
  border-color: #cf4e40;
}

.delete-btn {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #a48f75;
  font-size: 18px;
  opacity: 0;
}

.task-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
}

.new-task-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 1px dashed rgba(41, 34, 28, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.36);
  color: #7d6c55;
  font-weight: 750;
}

.new-task-card span {
  font-size: 18px;
}

.timeline {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(41, 34, 28, 0.1);
}

.timeline h3 {
  margin: 0 0 8px;
  color: #8b7a62;
  font-size: 11px;
  text-transform: uppercase;
}

.segment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.segment {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  color: #4a3d31;
  font-size: 12px;
}

.segment-mode {
  padding: 3px 6px;
  border-radius: 999px;
  background: rgba(232, 93, 77, 0.12);
  color: #b84437;
  font-weight: 800;
  text-align: center;
}

.segment-mode.rest,
.segment-mode.long_rest {
  background: rgba(95, 173, 156, 0.14);
  color: #3a8e7c;
}

.segment-task {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.segment-time {
  color: #8b7a62;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}
</style>
