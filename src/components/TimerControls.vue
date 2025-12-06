<template>
  <div class="controls">
    <button class="control-button" @click="$emit('toggle')" :class="{ active: isActive }">
      {{ isActive ? t('timer.pause') : t('timer.start') }}
    </button>
    <button class="control-button" @click="$emit('reset')">{{ t('timer.reset') }}</button>
    <button class="control-button" @click="$emit('skip')">{{ t('timer.skip') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
}>();
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 0; /* Parent handles gap */
}

.control-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  flex: 1; /* Stretch to fill */
  white-space: nowrap; /* Prevent wrap */
  
  /* Modern Flat/Clean look */
  background: #fff;
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.05),
    0 0 0 1px rgba(0,0,0,0.05); /* Border-like */
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.1s;
}

.control-button:active {
  transform: scale(0.98);
  background: #f5f5f5;
}

.control-button.active {
  background: #333;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>
