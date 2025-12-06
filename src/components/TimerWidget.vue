<template>
  <div 
    class="timer-widget" 
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="device-body">
      <!-- Screw detail -->
      <div class="screw top-left"></div>
      <div class="screw top-right"></div>
      <div class="screw bottom-left"></div>
      <div class="screw bottom-right"></div>

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
  /* Physical dimensions of the "device" */
  width: 400px;
  background-color: #e0e0e0;
  border-radius: 20px;
  padding: 20px;
  position: absolute; /* Changed to absolute for dragging */
  z-index: 100;
  cursor: grab;
  
  /* 3D Device Look */
  box-shadow: 
    10px 10px 30px rgba(0,0,0,0.4), /* Drop shadow on desk */
    inset 2px 2px 5px rgba(255,255,255,0.7), /* Highlight edge */
    inset -2px -2px 5px rgba(0,0,0,0.2); /* Shaded edge */
    
  transition: transform 0.05s ease-out, box-shadow 0.2s;
  user-select: none;
}

.timer-widget:active {
  cursor: grabbing;
  box-shadow: 
    15px 15px 40px rgba(0,0,0,0.5),
    inset 2px 2px 5px rgba(255,255,255,0.7),
    inset -2px -2px 5px rgba(0,0,0,0.2);
}

.device-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* Decorative Screws */
.screw {
  width: 10px;
  height: 10px;
  background: #bdc3c7;
  border-radius: 50%;
  position: absolute;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
}
.screw::after { /* The slot */
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #95a5a6;
  transform: translate(-50%, -50%) rotate(45deg);
}

.top-left { top: -10px; left: -10px; }
.top-right { top: -10px; right: -10px; }
.bottom-left { bottom: -10px; left: -10px; }
.bottom-right { bottom: -10px; right: -10px; }

.screen-frame {
  background: #2c2c2c;
  padding: 15px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
  border: 1px solid #444;
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
  font-family: monospace;
  background: #333;
  color: #f1c40f;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  border: 1px solid #555;
  box-shadow: 1px 1px 0 rgba(255,255,255,0.1);
}
</style>
