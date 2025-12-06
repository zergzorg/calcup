<template>
  <div 
    class="timer-widget" 
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="device-body">
      <!-- Основное табло таймера (LED/Flip) -->
      <div class="screen-frame">
        <TimerDisplay :time="formatTime" :mode="currentMode" />
      </div>

      <!-- Блок кнопок управления -->
      <div class="controls-area">
        <TimerControls
          :isActive="isActive"
          @toggle="toggleTimer"
          @reset="resetTimer"
          @skip="skipToNext"
        />
      </div>

      <!-- Блок настроек (Work / Break) -->
      <div class="settings-area">
        <TimerSettings
          :workMinutes="workMinutes"
          :restMinutes="restMinutes"
          :isActive="isActive"
          @incrementWork="incrementWork"
          @decrementWork="decrementWork"
          @incrementRest="incrementRest"
          @decrementRest="decrementRest"
        />
      </div>

      <!-- Прогресс-бар -->
      <div class="progress-area">
        <TimerProgress
          :mode="currentMode"
          :workProgress="progress"
          :restProgress="progress"
        />
      </div>

      <!-- Счетчик сессий -->
      <div class="sessions-plate">
        <span>SESS: {{ completedSessions + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePomodoro } from '../composables/usePomodoro';
import { useDraggable } from '../composables/useDraggable';
import TimerDisplay from './TimerDisplay.vue';
import TimerControls from './TimerControls.vue';
import TimerSettings from './TimerSettings.vue';
import TimerProgress from './TimerProgress.vue';

const {
  formatTime,
  currentMode,
  isActive,
  toggleTimer,
  resetTimer,
  skipToNext,
  workMinutes,
  restMinutes,
  incrementWork,
  decrementWork,
  incrementRest,
  decrementRest,
  progress,
  completedSessions
} = usePomodoro();

const { position, onMouseDown, onTouchStart } = useDraggable('timer_pos', 400, 100);
</script>

<style scoped>
.timer-widget {
  /* Compact Design */
  width: 280px;
  background-color: #f5f5f7; /* Very light gray, almost white */
  border-radius: 16px;
  padding: 16px;
  position: absolute;
  z-index: 100;
  cursor: grab;
  
  /* Modern Clean Look */
  box-shadow: 
    0 10px 25px rgba(0,0,0,0.1),
    0 4px 6px rgba(0,0,0,0.05),
    inset 0 0 0 1px rgba(255,255,255,0.5); /* Subtle highlight */
    
  transition: transform 0.05s ease-out, box-shadow 0.2s;
  user-select: none;
  backdrop-filter: blur(10px);
}

.timer-widget:active {
  cursor: grabbing;
  box-shadow: 
    0 15px 35px rgba(0,0,0,0.15),
    0 6px 10px rgba(0,0,0,0.08);
  transform: scale(1.02);
}

.device-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px; /* Reduced from 16px for tighter layout */
  position: relative;
}

.screen-frame {
  /* Removed heavy borders and dark backgrounds for a lighter look, 
     but TimerDisplay might still have its own dark BG. We'll adjust that next if needed. */
  width: 100%;
  display: flex;
  justify-content: center;
}

.controls-area, .settings-area {
  width: 100%;
  display: flex;
  justify-content: center;
}

.progress-area {
  width: 100%;
}

.sessions-plate {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #888;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
