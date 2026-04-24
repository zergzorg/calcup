<template>
  <div class="settings">
    <div class="row" v-for="row in rows" :key="row.target">
      <span class="label" :class="{ current: row.isCurrent }">
        <span class="swatch" :style="{ background: row.color }"></span>
        {{ row.label }}
      </span>
      <div class="stepper">
        <button
          class="step-btn"
          :disabled="isActive"
          :aria-label="`-1 ${row.label}`"
          @click="$emit('adjust', { target: row.target, delta: -1 })"
        >−</button>
        <span class="value">{{ row.value }}<span class="unit">m</span></span>
        <button
          class="step-btn"
          :disabled="isActive"
          :aria-label="`+1 ${row.label}`"
          @click="$emit('adjust', { target: row.target, delta: +1 })"
        >+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TimerMode } from '../composables/usePomodoro';

const { t } = useI18n();

const props = defineProps<{
  workMinutes: number;
  restMinutes: number;
  longRestMinutes: number;
  isActive: boolean;
  currentMode: TimerMode;
}>();

defineEmits<{
  (e: 'adjust', payload: { target: TimerMode; delta: 1 | -1 }): void;
}>();

const rows = computed(() => [
  {
    target: 'WORK' as TimerMode,
    label: t('timer.focus'),
    value: props.workMinutes,
    color: '#e85d4d',
    isCurrent: props.currentMode === 'WORK',
  },
  {
    target: 'REST' as TimerMode,
    label: t('timer.short_break'),
    value: props.restMinutes,
    color: '#5fad9c',
    isCurrent: props.currentMode === 'REST',
  },
  {
    target: 'LONG_REST' as TimerMode,
    label: t('timer.long_break'),
    value: props.longRestMinutes,
    color: '#6b8cae',
    isCurrent: props.currentMode === 'LONG_REST',
  },
]);
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: rgba(0, 0, 0, 0.025);
  border-radius: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.label.current {
  color: #1a1a1a;
}

.swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: #fff;
  border-radius: 8px;
  padding: 2px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.step-btn {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  background: transparent;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.step-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
}

.step-btn:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.08);
}

.step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.value {
  min-width: 40px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

.unit {
  font-weight: 400;
  color: #888;
  font-size: 11px;
  margin-left: 1px;
}

:global([data-layout="mobile"] .pomodoro .row){
  align-items: stretch;
  flex-direction: column;
}

:global([data-layout="mobile"] .pomodoro .stepper){
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

:global([data-layout="mobile"] .pomodoro .step-btn){
  width: 44px;
  height: 44px;
}
</style>
