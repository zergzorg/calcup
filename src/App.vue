<template>
  <div class="pomodoro-timer">
    <!-- Основное табло таймера (LED-экран) -->
    <TimerDisplay :time="formatTime" :mode="currentMode" />

    <!-- Блок кнопок управления -->
    <TimerControls
      :isActive="isActive"
      @toggle="toggleTimer"
      @reset="resetTimer"
      @skip="skipToNext"
    />

    <!-- Блок настроек (Work / Break) -->
    <TimerSettings
      :workMinutes="workMinutes"
      :restMinutes="restMinutes"
      :isActive="isActive"
      @incrementWork="incrementWork"
      @decrementWork="decrementWork"
      @incrementRest="incrementRest"
      @decrementRest="decrementRest"
    />

    <!-- Прогресс-бар -->
    <TimerProgress
      :mode="currentMode"
      :workProgress="progress"
      :restProgress="progress"
    />

    <!-- Счетчик сессий -->
    <div class="sessions">
      <span>Session {{ completedSessions + 1 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePomodoro } from './composables/usePomodoro';
import TimerDisplay from './components/TimerDisplay.vue';
import TimerControls from './components/TimerControls.vue';
import TimerSettings from './components/TimerSettings.vue';
import TimerProgress from './components/TimerProgress.vue';

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
</script>

<style scoped>
/* Общий контейнер */
.pomodoro-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 520px;
  margin: 40px auto;
  padding: 40px;
  border-radius: 20px;
  
  /* Modern "Analog" Look - Light Theme */
  background-color: #e0e0e0;
  box-shadow: 
    20px 20px 60px #bebebe, 
    -20px -20px 60px #ffffff;
  
  font-family: 'Helvetica Neue', Helvetica, monospace; 
  color: #333;
}

/* Счётчик сессий */
.sessions {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
