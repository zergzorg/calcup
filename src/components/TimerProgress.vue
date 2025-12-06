<template>
  <div class="progress-bar-wrapper">
    <div class="progress-container">
      <div class="segment work-segment" :class="{ active: mode === 'WORK' }">
        <div class="progress-fill" :style="{ width: workProgress + '%' }" v-if="mode === 'WORK'"></div>
      </div>
      <div class="segment rest-segment" :class="{ active: mode === 'REST' }">
        <div class="progress-fill" :style="{ width: restProgress + '%' }" v-if="mode === 'REST'"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimerMode } from '../composables/usePomodoro';

defineProps<{
  mode: TimerMode;
  workProgress: number;
  restProgress: number;
}>();
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
  padding: 4px;
  background: #e5e5e5;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  margin-bottom: 0;
}

.progress-container {
  display: flex;
  height: 8px; /* Thinner */
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  background-color: #d0d0d0;
}

.segment {
  height: 100%;
  position: relative;
  flex: 1;
  transition: all 0.3s ease;
}

/* Base colors for segments */
.work-segment {
  background-color: #d0d0d0;
}
.rest-segment {
  background-color: #c0c0c0;
}

.progress-fill {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  transition: width 1s linear;
  box-shadow: 2px 0 5px rgba(0,0,0,0.2);
}

.work-segment .progress-fill {
  background-color: #d9534f; /* Muted Red */
}
.rest-segment .progress-fill {
  background-color: #5cb85c; /* Muted Green */
}
</style>
