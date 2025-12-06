<template>
  <div class="progress-container">
    <div class="segment work-segment" :class="{ active: mode === 'WORK' }">
      <div class="progress-fill" :style="{ width: workProgress + '%' }" v-if="mode === 'WORK'"></div>
    </div>
    <div class="segment rest-segment" :class="{ active: mode === 'REST' }">
      <div class="progress-fill" :style="{ width: restProgress + '%' }" v-if="mode === 'REST'"></div>
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
.progress-container {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
  background-color: #333;
  box-shadow: inset 0 0 8px rgba(0, 255, 0, 0.6);
}

.segment {
  height: 100%;
  position: relative;
  flex: 1;
  transition: all 0.3s ease;
}

.work-segment {
  background-color: #330000;
}
.work-segment.active {
  background-color: #660000;
}
.rest-segment {
  background-color: #003300;
}
.rest-segment.active {
  background-color: #006600;
}

.progress-fill {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  transition: width 1s linear;
}

.work-segment .progress-fill {
  background-color: #ff4d4d;
}
.rest-segment .progress-fill {
  background-color: #4dff88;
}
</style>
