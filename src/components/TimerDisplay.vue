<template>
  <div class="timer-display">
    <div class="clock-container">
      <!-- Minutes -->
      <div class="digit-group">
        <FlipCard :value="minutesTens" />
        <FlipCard :value="minutesOnes" />
      </div>
      <div class="separator">:</div>
      <!-- Seconds -->
      <div class="digit-group">
        <FlipCard :value="secondsTens" />
        <FlipCard :value="secondsOnes" />
      </div>
    </div>
    
    <div class="timer-mode" :class="mode.toLowerCase()">{{ mode }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode } from '../composables/usePomodoro';
import FlipCard from './FlipCard.vue';

const props = defineProps<{
  time: string; // Format "MM:SS"
  mode: TimerMode;
}>();

const minutesTens = computed(() => props.time[0]);
const minutesOnes = computed(() => props.time[1]);
const secondsTens = computed(() => props.time[3]);
const secondsOnes = computed(() => props.time[4]);
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.clock-container {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #222;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3);
}

.digit-group {
  display: flex;
  gap: 4px;
}

.separator {
  font-size: 60px;
  font-weight: bold;
  color: #ccc;
  margin-top: -10px;
}

.timer-mode {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 25px;
  padding: 8px 16px;
  border-radius: 4px;
  color: #333;
  background-color: #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.timer-mode.work {
  background-color: #ffcccb; /* Light red */
  color: #8b0000;
}
.timer-mode.rest {
  background-color: #ccffcc; /* Light green */
  color: #006400;
}
</style>
