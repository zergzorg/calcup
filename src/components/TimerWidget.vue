<template>
  <div
    class="pomodoro"
    :class="`mode-${currentMode.toLowerCase()}`"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <header class="header">
      <span class="brand">{{ t('timer.title') }}</span>
      <SessionDots
        :total="sessionsPerCycle"
        :current="cycleSession"
        :mode="currentMode"
      />
    </header>

    <TimerDisplay
      :time="formatTime"
      :mode="currentMode"
      :progress="progress"
    />

    <div
      class="task-context"
      :class="{ empty: !timerTask }"
      @mousedown.stop
    >
      <span class="task-context-label">{{ contextLabel }}</span>
      <span class="task-context-text">{{ timerTask?.text || t('timer.no_task') }}</span>
    </div>

    <TimerControls
      :is-active="isActive"
      @toggle="toggleTimer"
      @reset="resetTimer"
      @skip="skipToNext"
    />

    <button
      class="adjust-toggle"
      :class="{ open: settingsOpen }"
      :aria-expanded="settingsOpen"
      @click="settingsOpen = !settingsOpen"
      @mousedown.stop
    >
      <span>{{ t('timer.adjust') }}</span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>

    <transition name="adjust">
      <div v-show="settingsOpen" class="adjust-panel">
        <TimerSettings
          :work-minutes="workMinutes"
          :rest-minutes="restMinutes"
          :long-rest-minutes="longRestMinutes"
          :is-active="isActive"
          :current-mode="currentMode"
          @adjust="onAdjust"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePomodoro, type TimerMode } from '../composables/usePomodoro';
import { useTaskPomodoro } from '../composables/useTaskPomodoro';
import { useDraggable } from '../composables/useDraggable';
import TimerDisplay from './TimerDisplay.vue';
import TimerControls from './TimerControls.vue';
import TimerSettings from './TimerSettings.vue';
import SessionDots from './SessionDots.vue';

const { t } = useI18n();
const {
  formatTime,
  currentMode,
  isActive,
  toggleTimer,
  resetTimer,
  skipToNext,
  workMinutes,
  restMinutes,
  longRestMinutes,
  sessionsPerCycle,
  cycleSession,
  incrementWork,
  decrementWork,
  incrementRest,
  decrementRest,
  incrementLongRest,
  decrementLongRest,
  progress,
} = usePomodoro();
const { activeTask, lastFocusTask } = useTaskPomodoro();

const { position, onMouseDown, onTouchStart } = useDraggable('timer_pos', 400, 100);

const settingsOpen = ref(false);
const timerTask = computed(() => currentMode.value === 'WORK' ? activeTask.value : lastFocusTask.value);
const contextLabel = computed(() => currentMode.value === 'WORK' ? t('timer.current_task') : t('timer.break_after'));

const onAdjust = ({ target, delta }: { target: TimerMode; delta: 1 | -1 }) => {
  if (target === 'WORK') {
    delta > 0 ? incrementWork() : decrementWork();
  } else if (target === 'REST') {
    delta > 0 ? incrementRest() : decrementRest();
  } else {
    delta > 0 ? incrementLongRest() : decrementLongRest();
  }
};
</script>

<style scoped>
.pomodoro {
  --accent: #e85d4d;
  --accent-soft: rgba(232, 93, 77, 0.14);
  --accent-deep: #c0392b;

  width: 320px;
  background: #fafaf6;
  border-radius: 20px;
  padding: 22px 22px 18px;
  position: absolute;
  z-index: 100;
  cursor: grab;

  display: flex;
  flex-direction: column;
  gap: 14px;

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 12px 28px rgba(0, 0, 0, 0.18),
    0 4px 8px rgba(0, 0, 0, 0.06);

  transition:
    transform 0.05s ease-out,
    box-shadow 0.25s ease;

  user-select: none;
}

.pomodoro.mode-rest {
  --accent: #5fad9c;
  --accent-soft: rgba(95, 173, 156, 0.16);
  --accent-deep: #3a8e7c;
}

.pomodoro.mode-long_rest {
  --accent: #6b8cae;
  --accent-soft: rgba(107, 140, 174, 0.16);
  --accent-deep: #4a6f93;
}

.pomodoro:active {
  cursor: grabbing;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 18px 36px rgba(0, 0, 0, 0.22),
    0 6px 12px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}

.brand {
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: #999;
}

.task-context {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 50px;
  padding: 10px 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.045), rgba(0, 0, 0, 0.025));
  border: 1px solid rgba(0, 0, 0, 0.055);
}

.task-context.empty {
  opacity: 0.62;
}

.task-context-label {
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
  color: var(--accent-deep, #c0392b);
}

.task-context-text {
  overflow: hidden;
  color: #24201d;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.adjust-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 6px auto 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #999;
  padding: 6px 12px;
  border-radius: 8px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.adjust-toggle:hover {
  color: #555;
  background: rgba(0, 0, 0, 0.04);
}

.adjust-toggle .chevron {
  width: 12px;
  height: 12px;
  fill: currentColor;
  transition: transform 0.25s ease;
}

.adjust-toggle.open .chevron {
  transform: rotate(180deg);
}

.adjust-panel {
  overflow: hidden;
}

.adjust-enter-active,
.adjust-leave-active {
  transition: max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease;
}

.adjust-enter-from,
.adjust-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: -8px;
}

.adjust-enter-to,
.adjust-leave-from {
  max-height: 240px;
  opacity: 1;
  margin-top: 0;
}
</style>
