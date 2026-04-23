<template>
  <div class="display">
    <svg class="ring" viewBox="0 0 200 200" aria-hidden="true">
      <circle class="ring-track" cx="100" cy="100" :r="RADIUS" />
      <circle
        class="ring-progress"
        cx="100"
        cy="100"
        :r="RADIUS"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 100 100)"
      />
    </svg>

    <div class="center">
      <div class="time">{{ time }}</div>
      <div class="mode-label">{{ modeLabel }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode } from '../composables/usePomodoro';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  time: string;
  mode: TimerMode;
  progress: number;
}>();

const RADIUS = 92;
const circumference = 2 * Math.PI * RADIUS;
const dashOffset = computed(
  () => circumference - (Math.min(100, Math.max(0, props.progress)) / 100) * circumference
);

const modeLabel = computed(() => {
  switch (props.mode) {
    case 'WORK':
      return t('timer.focus');
    case 'REST':
      return t('timer.short_break');
    case 'LONG_REST':
      return t('timer.long_break');
  }
});
</script>

<style scoped>
.display {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 8px;
}

.ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ring-track,
.ring-progress {
  fill: none;
  stroke-width: 6;
}

.ring-track {
  stroke: rgba(0, 0, 0, 0.06);
}

.ring-progress {
  stroke: var(--accent, #e85d4d);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.95s linear, stroke 0.6s ease;
  filter: drop-shadow(0 1px 2px var(--accent-soft, rgba(232, 93, 77, 0.25)));
}

.center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.time {
  font-family: 'SF Pro Display', 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 56px;
  font-weight: 200;
  letter-spacing: -1.5px;
  color: #1a1a1a;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

.mode-label {
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2.4px;
  color: var(--accent-deep, #c0392b);
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft, rgba(232, 93, 77, 0.12));
  transition: color 0.6s ease, background-color 0.6s ease;
}
</style>
