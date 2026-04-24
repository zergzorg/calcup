<template>
  <div
    class="date-countdown"
    data-widget-key="date_timer_pos"
    :class="{ expired: isExpired }"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex }"
    @mousedown.capture="activateWidget"
    @touchstart.capture="activateWidget"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="countdown-shell">
      <header class="countdown-header">
        <div>
          <p class="eyebrow">{{ t('dateTimer.title') }}</p>
          <h2>{{ statusLabel }}</h2>
        </div>

        <button class="change-btn" @click="openPicker" @mousedown.stop>
          {{ t('dateTimer.change') }}
        </button>
      </header>

      <div class="target-card" @mousedown.stop>
        <span>{{ t('dateTimer.target') }}</span>
        <strong>{{ formattedTarget }}</strong>
        <input
          ref="dateInput"
          type="datetime-local"
          class="date-input"
          :value="inputValue"
          :min="minInputValue"
          @change="onDateChange"
          @input="onDateChange"
          @click.stop
        />
      </div>

      <div class="time-grid" aria-live="polite">
        <div class="time-cell days">
          <strong>{{ timeRemaining.days }}</strong>
          <span>{{ t('dateTimer.units.days') }}</span>
        </div>
        <div class="time-cell">
          <strong>{{ twoDigits(timeRemaining.hours) }}</strong>
          <span>{{ t('dateTimer.units.hours') }}</span>
        </div>
        <div class="time-cell">
          <strong>{{ twoDigits(timeRemaining.minutes) }}</strong>
          <span>{{ t('dateTimer.units.minutes') }}</span>
        </div>
        <div class="time-cell">
          <strong>{{ twoDigits(timeRemaining.seconds) }}</strong>
          <span>{{ t('dateTimer.units.seconds') }}</span>
        </div>
      </div>

      <div class="progress-block" @mousedown.stop>
        <div class="progress-track">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <span>{{ helperText }}</span>
      </div>

      <div class="preset-row" @mousedown.stop>
        <button v-for="preset in presets" :key="preset.key" @click="applyPreset(preset.days)">
          {{ t(preset.label) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDateCalculator } from '../composables/useDateCalculator';
import { useDraggable } from '../composables/useDraggable';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const {
  targetDate,
  setTargetDate,
  setTargetFromLocalValue,
  timeRemaining,
  isExpired,
  inputValue,
  progress,
} = useDateCalculator();
const { position, zIndex, activateWidget, onMouseDown, onTouchStart } = useDraggable('date_timer_pos', 450, 450);

const dateInput = ref<HTMLInputElement | null>(null);
const presets = [
  { key: 'week', label: 'dateTimer.presets.week', days: 7 },
  { key: 'month', label: 'dateTimer.presets.month', days: 30 },
  { key: 'quarter', label: 'dateTimer.presets.quarter', days: 90 },
];

const toDatetimeLocal = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const minInputValue = computed(() => toDatetimeLocal(new Date()));
const formattedTarget = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(targetDate.value);
});
const statusLabel = computed(() => isExpired.value ? t('dateTimer.expired') : t('dateTimer.remaining'));
const helperText = computed(() => {
  if (isExpired.value) return t('dateTimer.expired_hint');
  if (timeRemaining.value.days === 0) return t('dateTimer.today_hint');
  return t('dateTimer.helper');
});

const twoDigits = (value: number) => value.toString().padStart(2, '0');

const openPicker = () => {
  const input = dateInput.value;
  if (!input) return;
  input.focus();

  if (typeof input.showPicker === 'function') {
    input.showPicker();
  }
};

const onDateChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  setTargetFromLocalValue(input.value);
};

const applyPreset = (days: number) => {
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setSeconds(0, 0);
  setTargetDate(next);
};
</script>

<style scoped>
.date-countdown {
  width: min(430px, 100%);
  position: absolute;
  z-index: 100;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;
  box-sizing: border-box;
}

.date-countdown:active {
  cursor: grabbing;
  z-index: 150;
}

.countdown-shell {
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(31, 35, 41, 0.98), rgba(15, 18, 23, 0.96));
  box-shadow:
    0 26px 60px rgba(0, 0, 0, 0.34),
    0 8px 18px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.countdown-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.eyebrow {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.48);
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f7f0e6;
  font-family: 'SF Pro Display', 'Inter', system-ui, sans-serif;
  font-size: 25px;
  font-weight: 760;
  line-height: 1.05;
}

.change-btn,
.preset-row button {
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
}

.change-btn {
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #f7d46b;
  font-size: 12px;
  font-weight: 800;
}

.change-btn:hover {
  background: rgba(255, 255, 255, 0.13);
}

.target-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.055);
}

.target-card span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.target-card strong {
  color: rgba(255, 255, 255, 0.92);
  font-size: 15px;
  font-weight: 720;
}

.date-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.time-grid {
  display: grid;
  grid-template-columns: 1.45fr repeat(3, 1fr);
  gap: 8px;
}

.time-cell {
  min-width: 0;
  padding: 14px 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.095), rgba(255, 255, 255, 0.045)),
    repeating-linear-gradient(0deg, transparent 0 17px, rgba(255, 255, 255, 0.025) 18px);
}

.time-cell strong {
  display: block;
  color: #f8f5ee;
  font-family: 'SF Pro Display', 'Inter', system-ui, sans-serif;
  font-size: 34px;
  font-weight: 760;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.time-cell.days strong {
  font-size: 38px;
}

.time-cell span {
  display: block;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.46);
  font-size: 10px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
}

.progress-block {
  margin-top: 14px;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f7d46b, #f28f61);
  transition: width 0.4s ease;
}

.progress-block > span {
  display: block;
  margin-top: 7px;
  color: rgba(255, 255, 255, 0.52);
  font-size: 12px;
  font-weight: 650;
}

.preset-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 14px;
}

.preset-row button {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 760;
}

.preset-row button:hover {
  background: rgba(255, 255, 255, 0.11);
  color: #fff;
}

.date-countdown.expired .progress-track span {
  width: 100% !important;
  background: linear-gradient(90deg, #7ddc91, #5fb6d9);
}

@media (max-width: 720px) {
  .date-countdown {
    width: min(390px, 100%);
  }

  .time-cell strong {
    font-size: 28px;
  }

  .time-cell.days strong {
    font-size: 32px;
  }
}

:global([data-layout="mobile"]) .countdown-shell {
  padding: 16px;
}

:global([data-layout="mobile"]) .countdown-header {
  align-items: stretch;
  flex-direction: column;
}

:global([data-layout="mobile"]) .change-btn,
:global([data-layout="mobile"]) .preset-row button {
  min-height: 44px;
}

:global([data-layout="mobile"]) .time-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

:global([data-layout="mobile"]) .time-cell strong,
:global([data-layout="mobile"]) .time-cell.days strong {
  font-size: 30px;
}
</style>
