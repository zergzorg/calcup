<template>
  <div class="settings-menu-container">
    <button class="settings-btn" @click.stop="toggleMenu" :title="t('settings.title')">
      ⚙️
    </button>

    <div v-if="isOpen" class="settings-panel" @click.stop>
      <h3>{{ t('settings.background') || 'Background' }}</h3>
      
      <!-- Color Picker -->
      <div class="color-grid">
        <button 
          v-for="color in COLORS" 
          :key="color.id"
          class="color-option"
          :class="{ active: settings.backgroundColor === color.value }"
          :style="{ backgroundColor: color.value }"
          :title="t(color.i18nKey)"
          @click="updateSetting('backgroundColor', color.value)"
        ></button>
        
        <!-- Custom Color Picker -->
        <div class="color-option custom-color-wrapper" :class="{ active: !COLORS.find(c => c.value === settings.backgroundColor) }">
          <input 
            type="color" 
            :value="settings.backgroundColor"
            @input="(e) => updateSetting('backgroundColor', (e.target as HTMLInputElement).value)"
            class="custom-color-input"
            title="Custom Color"
          />
          <div class="plus-icon">+</div>
        </div>
      </div>

      <!-- Pattern Picker -->
      <select 
        :value="settings.pattern" 
        @change="(e) => updateSetting('pattern', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="pattern in PATTERNS" :key="pattern.id" :value="pattern.id">
          {{ t(pattern.i18nKey) }}
        </option>
      </select>

      <h3>{{ t('settings.widgets') }}</h3>
      <ul class="widget-list">
        <li v-for="widget in widgets" :key="widget.id" class="widget-item">
          <label>
            <input 
              type="checkbox" 
              :checked="widget.visible" 
              @change="toggleWidget(widget.id)"
            />
            {{ t(widget.name) }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useWidgets } from '../composables/useWidgets';
import { useDesktopSettings } from '../composables/useDesktopSettings';
import { useI18n } from 'vue-i18n';

const { widgets, toggleWidget } = useWidgets();
const { settings, updateSetting, COLORS, PATTERNS } = useDesktopSettings();
const { t } = useI18n();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('click', closeMenu);
  } else {
    document.removeEventListener('click', closeMenu);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style scoped>
.settings-menu-container {
  position: relative;
  display: inline-block;
}

.settings-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  transition: transform 0.2s;
  color: #e0e0e0;
}

.settings-btn:hover {
  transform: rotate(90deg);
}

.settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  min-width: 250px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 2000;
  color: #fff;
  max-height: 80vh;
  overflow-y: auto;
}

h3 {
  margin: 16px 0 12px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h3:first-child {
  margin-top: 0;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
}

select {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
}

.widget-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.widget-item {
  margin-bottom: 8px;
}

.widget-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 0;
  transition: color 0.2s;
}

.widget-item label:hover {
  color: #4caf50;
}

input[type="checkbox"] {
  accent-color: #4caf50;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.custom-color-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  background: conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #00FFFF 112.5deg, #0000FF 228.75deg, #FF0000 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Robust clipping for WebKit */
  -webkit-clip-path: circle(50% at 50% 50%);
  clip-path: circle(50% at 50% 50%);
}

.custom-color-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
  -webkit-appearance: none;
}

.plus-icon {
  pointer-events: none;
  font-size: 20px;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  font-weight: bold;
  z-index: 1;
}
</style>
