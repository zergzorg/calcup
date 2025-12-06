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
  gap: 20px;
  margin-bottom: 40px;
}

.control-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  /* Metallic/Plastic look */
  background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
  box-shadow: 
    0 4px 6px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.8);
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.1s;
}

.control-button:active {
  transform: translateY(2px);
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.8);
  background: linear-gradient(to bottom, #d0d0d0, #f0f0f0);
}

.control-button.active {
  background: linear-gradient(to bottom, #ffd700, #ffaa00); /* Amber/Orange for active */
  color: #5a3a00;
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.4);
}
</style>
