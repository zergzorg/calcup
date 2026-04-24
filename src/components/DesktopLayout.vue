<template>
  <div class="desktop-layout" :style="currentStyle">
    <div class="desk-surface" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100/scale}%`, height: `${100/scale}%` }">
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
      <button @click="$emit('shuffleWidgets')" class="desk-btn" :title="t('shuffle_widgets')">
        🔀 {{ t('shuffle_widgets') }}
      </button>
      <button @click="$emit('clearAll')" class="clear-btn" :title="t('title')">
        🗑️ {{ t('reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScale } from '../composables/useScale';
import { useDesktopSettings } from '../composables/useDesktopSettings';
import LanguageSwitcher from './LanguageSwitcher.vue';
import SettingsMenu from './SettingsMenu.vue';
import { useI18n } from 'vue-i18n';

defineEmits(['clearAll', 'shuffleWidgets']);

const { scale } = useScale();
const { currentStyle } = useDesktopSettings();
const { t } = useI18n();
</script>

<style scoped>
.desktop-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Changed from hidden to auto if we want scrolling, but design calls for fit */
  position: relative;
  /* Dynamic Background */
  transition: all 0.5s ease;
  box-shadow: inset 0 0 150px rgba(0,0,0,0.3);
}

.desk-surface {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  /* Flex removed to allow absolute positioning of draggable items */
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
</style>
