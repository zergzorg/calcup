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
  padding: 30px;
  border: 2px solid #222;
  border-radius: 16px;
  background: #111;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2) inset;
  font-family: 'Digital-7 Mono', monospace; /* или любой другой, подходящий под LED-стиль */
  color: #0f0; /* Ярко-зелёный */
}

/* Счётчик сессий */
.sessions {
  text-align: center;
  font-size: 15px;
  color: #7f7;
}
</style>
