<template>
  <div class="dots" :title="t('timer.session_of', { current, total })">
    <span
      v-for="i in total"
      :key="i"
      class="dot"
      :class="{
        filled: isFilled(i),
        active: isActive(i),
      }"
    ></span>
  </div>
</template>

<script setup lang="ts">
import type { TimerMode } from '../composables/usePomodoro';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  total: number;
  current: number;
  mode: TimerMode;
}>();

const isFilled = (i: number) =>
  props.mode === 'WORK' ? i < props.current : i <= props.current;

const isActive = (i: number) => props.mode === 'WORK' && i === props.current;
</script>

<style scoped>
.dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  transition: background-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}

.dot.filled {
  background: var(--accent, #c0392b);
}

.dot.active {
  background: var(--accent, #e85d4d);
  box-shadow: 0 0 0 4px var(--accent-soft, rgba(232, 93, 77, 0.18));
  transform: scale(1.05);
}
</style>
