<template>
  <div class="timer-display">
    <div class="timer-value">{{ time }}</div>
    <div class="timer-mode" :class="mode.toLowerCase()">{{ mode }}</div>
  </div>
</template>

<script setup lang="ts">
import type { TimerMode } from '../composables/usePomodoro';

defineProps<{
  time: string;
  mode: TimerMode;
}>();
</script>

<style scoped>
.timer-display {
  text-align: center;
  margin-bottom: 30px;
}

.timer-value {
  font-size: 100px;
  line-height: 1.2;
  font-weight: 700;
  text-shadow:
      0 0 10px #0f0,
      0 0 20px #0f0,
      0 0 40px #0f0;
}

.timer-mode {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-top: 8px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  color: #0f0;
  background-color: #222;
  text-shadow:
      0 0 2px #0f0,
      0 0 4px #0f0;
}

.timer-mode.work {
  border: 1px solid #ff4d4d;
  background-color: #330000;
}
.timer-mode.rest {
  border: 1px solid #4dff88;
  background-color: #003300;
}
</style>
