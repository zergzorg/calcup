<template>
  <div class="timer-display">
    <div class="clock-transform-wrapper">
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
    </div>
    
    <div class="timer-mode" :class="mode.toLowerCase()">{{ t('timer.' + mode.toLowerCase()) }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode } from '../composables/usePomodoro';
import FlipCard from './FlipCard.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
  margin-bottom: 20px;
  width: 100%;
}

.clock-transform-wrapper {
  /* Scale down to fit 280px container */
  transform: scale(0.65); 
  transform-origin: center top;
  margin-bottom: -30px; /*Compensate for empty space after scaling */
}

.clock-container {
  display: flex;
  align-items: center;
  gap: 15px;
  /* Removed dark background for cleaner look */
  padding: 10px;
}

.digit-group {
  display: flex;
  gap: 4px;
}

.separator {
  font-size: 60px;
  font-weight: bold;
  color: #333; /* Dark text instead of light gray */
  margin-top: -10px;
}

.timer-mode {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 10px;
  padding: 4px 12px;
  border-radius: 12px;
  color: #555;
  background-color: rgba(0,0,0,0.05);
}

.timer-mode.work {
  color: #d32f2f;
  background-color: rgba(211, 47, 47, 0.1);
}
.timer-mode.rest {
  color: #388e3c;
  background-color: rgba(56, 142, 60, 0.1);
}
</style>
