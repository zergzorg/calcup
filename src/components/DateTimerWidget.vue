<template>
  <div 
    class="timer-widget date-timer-widget" 
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="device-body">
      <!-- Screw details -->
      <div class="screw top-left"></div>
      <div class="screw top-right"></div>
      <div class="screw bottom-left"></div>
      <div class="screw bottom-right"></div>

      <!-- Main Display -->
      <div class="screen-frame">
        <div class="clock-display">
          <!-- Days -->
          <div class="digit-group" title="Days">
            <FlipCard :value="formattedTime.days[0]" />
            <FlipCard :value="formattedTime.days[1]" />
            <FlipCard :value="formattedTime.days[2]" />
          </div>
          <div class="separator">:</div>
          <!-- Hours -->
          <div class="digit-group" title="Hours">
            <FlipCard :value="formattedTime.hours[0]" />
            <FlipCard :value="formattedTime.hours[1]" />
          </div>
          <div class="separator">:</div>
          <!-- Minutes -->
          <div class="digit-group" title="Minutes">
            <FlipCard :value="formattedTime.minutes[0]" />
            <FlipCard :value="formattedTime.minutes[1]" />
          </div>
          <div class="separator">:</div>
          <!-- Seconds -->
          <div class="digit-group" title="Seconds">
            <FlipCard :value="formattedTime.seconds[0]" />
            <FlipCard :value="formattedTime.seconds[1]" />
          </div>
        </div>
      </div>

      <!-- Target Info & Controls -->
      <div class="info-area">
        <div class="target-label">
          {{ t('dateTimer.target') }}: 
          <span class="target-date-text">{{ targetDate.toLocaleDateString() }} {{ targetDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
        </div>
        
        <button class="change-btn" @click="openPicker" @mousedown.stop>
          {{ t('dateTimer.change') }}
        </button>
        <input 
          ref="dateInput"
          type="datetime-local" 
          class="hidden-input"
          @change="onDateChange"
          @input="onDateChange"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDateCalculator } from '../composables/useDateCalculator';

import { useDraggable } from '../composables/useDraggable';
import FlipCard from './FlipCard.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { targetDate, setTargetDate, formattedTime } = useDateCalculator();
const { position, onMouseDown, onTouchStart } = useDraggable('date_timer_pos', 450, 450);

const dateInput = ref<HTMLInputElement | null>(null);

const openPicker = () => {
  try {
    dateInput.value?.showPicker();
  } catch (e) {
    // Fallback
    dateInput.value?.click(); 
  }
};

const onDateChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.value) {
    const newDate = new Date(input.value);
    setTargetDate(newDate);
  }
};
</script>

<style scoped>
.timer-widget {
  width: 420px; /* Reduced from 580px */
  background-color: #e0e0e0;
  border-radius: 20px;
  padding: 20px;
  position: absolute;
  z-index: 100;
  cursor: grab;
  box-shadow: 
    10px 10px 30px rgba(0,0,0,0.4),
    inset 2px 2px 5px rgba(255,255,255,0.7),
    inset -2px -2px 5px rgba(0,0,0,0.2);
  transition: transform 0.05s ease-out, box-shadow 0.2s;
  user-select: none;
}

.timer-widget:active {
  cursor: grabbing;
  box-shadow: 
    15px 15px 40px rgba(0,0,0,0.5),
    inset 2px 2px 5px rgba(255,255,255,0.7),
    inset -2px -2px 5px rgba(0,0,0,0.2);
}

.device-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

.screw {
  width: 10px;
  height: 10px;
  background: #bdc3c7;
  border-radius: 50%;
  position: absolute;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
}
.screw::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 100%; height: 2px;
  background: #95a5a6;
  transform: translate(-50%, -50%) rotate(45deg);
}
.top-left { top: -10px; left: -10px; }
.top-right { top: -10px; right: -10px; }
.bottom-left { bottom: -10px; left: -10px; }
.bottom-right { bottom: -10px; right: -10px; }

.screen-frame {
  background: #2c2c2c;
  padding: 0; /* Reduced padding */
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
  border: 1px solid #444;
  width: 100%;
  height: 120px; /* Fixed height for consistency */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.clock-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #222;
  padding: 10px;
  border-radius: 12px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
  transform: scale(0.55); /* Smaller scale to fit */
  transform-origin: center;
}

.digit-group {
  display: flex;
  gap: 4px;
}

.separator {
  font-size: 40px;
  font-weight: bold;
  color: #ccc;
  margin-top: -10px;
}

.info-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: #d0d0d0;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1);
}

.target-label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.target-date-text {
  color: #333;
  font-weight: bold;
}

.change-btn {
  background: #333;
  color: #f1c40f;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}

.change-btn:hover {
  background: #444;
}

.hidden-input {
  position: absolute;
  top: 0; left: 0;
  width: 0; height: 0;
  opacity: 0;
  padding: 0;
  margin: 0;
  border: none;
  visibility: hidden;
}
</style>
