<template>
  <div class="desktop-layout" :data-layout="layoutMode" :style="currentStyle">
    <div class="desk-surface" :style="surfaceStyle">
      <!-- Slot for desktop items (Timer, Notepad, Radio) -->
      <slot></slot>
    </div>
    
    <!-- Language Switcher and Settings (Top Right) -->
    <div class="lang-container">
      <SettingsMenu />
      <LanguageSwitcher />
    </div>

    <!-- Global Controls (Bottom Right) -->
    <div class="desk-controls">
      <button
        v-if="!isMobileLayout"
        @click="$emit('shuffleWidgets')"
        class="desk-btn shuffle-btn"
        :title="t('shuffle_widgets')"
      >
        🔀 {{ t('shuffle_widgets') }}
      </button>
      <button @click="$emit('clearAll')" class="clear-btn" :title="t('title')">
        🗑️ {{ t('reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useScale } from '../composables/useScale';
import { useDesktopSettings } from '../composables/useDesktopSettings';
import { useMobileLayout } from '../composables/useMobileLayout';
import LanguageSwitcher from './LanguageSwitcher.vue';
import SettingsMenu from './SettingsMenu.vue';
import { useI18n } from 'vue-i18n';

defineEmits(['clearAll', 'shuffleWidgets']);

const { scale } = useScale();
const { currentStyle } = useDesktopSettings();
const { isMobileLayout } = useMobileLayout();
const { t } = useI18n();

const layoutMode = computed(() => isMobileLayout.value ? 'mobile' : 'desktop');
const surfaceStyle = computed(() => {
  if (isMobileLayout.value) {
    return {};
  }

  return {
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left',
    width: `${100 / scale.value}%`,
    height: `${100 / scale.value}%`,
  };
});

watch(layoutMode, (mode) => {
  document.body.dataset.layout = mode;
}, { immediate: true });
</script>

<style scoped>
.desktop-layout {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  /* Dynamic Background */
  transition: all 0.5s ease;
  box-shadow: inset 0 0 150px rgba(0,0,0,0.3);
  box-sizing: border-box;
}

.desk-surface {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  /* Flex removed to allow absolute positioning of draggable items */
}

.desktop-layout[data-layout="mobile"] {
  min-height: 100vh;
  min-height: 100dvh;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.desktop-layout[data-layout="mobile"] .desk-surface {
  width: 100%;
  min-height: 100dvh;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding:
    calc(92px + env(safe-area-inset-top, 0px))
    max(14px, env(safe-area-inset-right, 0px))
    calc(96px + env(safe-area-inset-bottom, 0px))
    max(14px, env(safe-area-inset-left, 0px));
  box-sizing: border-box;
  transform: none;
}

.desktop-layout[data-layout="mobile"] :deep([data-widget-key]) {
  position: static !important;
  transform: none !important;
  width: min(100%, 430px);
  max-width: 100%;
  box-sizing: border-box;
  cursor: default;
}

.lang-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 16px;
  align-items: center;
}

.desktop-layout[data-layout="mobile"] .lang-container {
  position: fixed;
  top: calc(14px + env(safe-area-inset-top, 0px));
  right: max(14px, env(safe-area-inset-right, 0px));
}

.desk-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  opacity: 0.5;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  gap: 16px;
}

.desk-controls:hover {
  opacity: 1;
}

.desktop-layout[data-layout="mobile"] .desk-controls {
  position: fixed;
  right: max(14px, env(safe-area-inset-right, 0px));
  bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  opacity: 1;
}

.desk-btn,
.clear-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  transition: transform 0.2s;
}

.desk-btn:hover,
.clear-btn:hover {
  transform: scale(1.1);
}

.desk-btn {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 800;
}

@media (hover: none) {
  .desk-controls {
    opacity: 1;
  }

  .desk-btn:hover,
  .clear-btn:hover {
    transform: none;
  }
}
</style>
