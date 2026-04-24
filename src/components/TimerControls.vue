<template>
  <div class="controls">
    <button
      class="icon-btn"
      :title="t('timer.reset')"
      :aria-label="t('timer.reset')"
      @click="$emit('reset')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      </svg>
    </button>

    <button
      class="primary-btn"
      :class="{ active: isActive }"
      @click="$emit('toggle')"
    >
      <svg v-if="!isActive" viewBox="0 0 24 24" class="icon" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="icon" aria-hidden="true">
        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
      </svg>
      <span class="label">{{ primaryLabel }}</span>
    </button>

    <button
      class="icon-btn"
      :title="t('timer.skip')"
      :aria-label="t('timer.skip')"
      @click="$emit('skip')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
}>();

const primaryLabel = computed(() => (props.isActive ? t('timer.pause') : t('timer.start')));
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
  padding: 0;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.icon-btn:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.05);
}

.icon-btn:active {
  transform: scale(0.94);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: var(--accent, #e85d4d);
  color: #fff;
  cursor: pointer;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  box-shadow:
    0 6px 14px var(--accent-soft, rgba(232, 93, 77, 0.32)),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.6s ease, filter 0.2s ease;
}

.primary-btn .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.primary-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow:
    0 10px 22px var(--accent-soft, rgba(232, 93, 77, 0.4)),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.primary-btn:active {
  transform: translateY(0);
  filter: brightness(0.96);
  box-shadow:
    0 4px 10px var(--accent-soft, rgba(232, 93, 77, 0.3)),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.primary-btn.active {
  background: var(--accent-deep, #c0392b);
}

:global([data-layout="mobile"] .pomodoro .controls){
  gap: 10px;
}

:global([data-layout="mobile"] .pomodoro .primary-btn){
  min-width: 132px;
  height: 48px;
  padding: 0 18px;
}
</style>
