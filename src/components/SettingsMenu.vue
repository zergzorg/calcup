<template>
  <div class="settings-menu-container">
    <button class="settings-btn" @click.stop="toggleMenu" :title="t('settings.title')" :aria-expanded="isOpen">
      <span class="settings-btn-icon" aria-hidden="true">⚙️</span>
    </button>

    <div v-if="isOpen" class="settings-panel" @click.stop>
      <section class="settings-section">
        <h3>{{ t('settings.background') || 'Background' }}</h3>

        <div class="color-grid">
          <button
            v-for="color in COLORS"
            :key="color.id"
            class="color-option"
            :class="{ active: settings.backgroundColor === color.value }"
            :style="{ '--swatch-color': color.value }"
            :title="t(color.i18nKey)"
            @click="updateSetting('backgroundColor', color.value)"
          >
            <span class="color-dot"></span>
            <span class="color-label">{{ t(color.i18nKey) }}</span>
          </button>

          <label class="color-option custom-color-wrapper" :class="{ active: !COLORS.find(c => c.value === settings.backgroundColor) }">
            <input
              type="color"
              :value="settings.backgroundColor"
              @input="(e) => updateSetting('backgroundColor', (e.target as HTMLInputElement).value)"
              class="custom-color-input"
              :title="t('settings.colors.custom')"
            />
            <span class="color-dot custom-color-dot">
              <span class="plus-icon">+</span>
            </span>
            <span class="color-label">{{ t('settings.colors.custom') }}</span>
          </label>
        </div>
      </section>

      <section class="settings-section">
        <h3>{{ t('settings.pattern') }}</h3>
        <div class="select-shell">
          <select
            :value="settings.pattern"
            @change="(e) => updateSetting('pattern', (e.target as HTMLSelectElement).value)"
          >
            <option v-for="pattern in PATTERNS" :key="pattern.id" :value="pattern.id">
              {{ t(pattern.i18nKey) }}
            </option>
          </select>
        </div>
      </section>

      <section class="settings-section">
        <h3>{{ t('settings.widgets') }}</h3>
        <ul class="widget-list">
          <li v-for="widget in widgets" :key="widget.id" class="widget-item">
            <label>
              <input
                type="checkbox"
                :checked="widget.visible"
                @change="toggleWidget(widget.id)"
              />
              <span class="checkmark"></span>
              <span>{{ t(widget.name) }}</span>
            </label>
          </li>
        </ul>
      </section>
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
  width: 50px;
  height: 50px;
  display: inline-grid;
  place-items: center;
  background: rgba(19, 23, 28, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 0;
  color: rgba(255, 255, 255, 0.86);
  cursor: pointer;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px) saturate(1.2);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.settings-btn:hover {
  background: rgba(25, 31, 38, 0.72);
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
}

.settings-btn:focus-visible {
  outline: 3px solid rgba(116, 199, 255, 0.4);
  outline-offset: 3px;
}

.settings-btn-icon {
  display: block;
  font-size: 27px;
  line-height: 1;
  transform-origin: 50% 50%;
  transition: transform 0.28s ease;
}

.settings-btn:hover .settings-btn-icon,
.settings-btn[aria-expanded="true"] .settings-btn-icon {
  transform: rotate(68deg);
}

.settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 14px;
  width: min(360px, calc(100vw - 32px));
  background: linear-gradient(145deg, rgba(36, 40, 46, 0.96), rgba(18, 20, 24, 0.94));
  backdrop-filter: blur(24px) saturate(1.22);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.44), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  z-index: 2000;
  color: rgba(255, 255, 255, 0.92);
  max-height: min(78vh, 720px);
  overflow-y: auto;
  animation: settings-panel-in 0.2s ease both;
}

.settings-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 74%);
}

.settings-section {
  position: relative;
}

.settings-section + .settings-section {
  margin-top: 24px;
}

h3 {
  margin: 0 0 14px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  padding-bottom: 10px;
  color: rgba(255, 255, 255, 0.48);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.color-option {
  --swatch-color: #fff;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.color-option:hover {
  background: rgba(255, 255, 255, 0.075);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}

.color-option.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 12px 26px rgba(0, 0, 0, 0.18);
  color: #fff;
}

.color-dot {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border-radius: 50%;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.15), transparent 42%),
    var(--swatch-color);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 8px 16px rgba(0, 0, 0, 0.22);
}

.color-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-shell {
  position: relative;
}

.select-shell::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(255, 255, 255, 0.72);
  border-bottom: 2px solid rgba(255, 255, 255, 0.72);
  transform: translateY(-62%) rotate(45deg);
  pointer-events: none;
}

select {
  width: 100%;
  appearance: none;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
  padding: 13px 44px 13px 15px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

select:focus {
  outline: none;
  border-color: rgba(116, 199, 255, 0.5);
  box-shadow: 0 0 0 4px rgba(116, 199, 255, 0.12);
}

.widget-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.widget-item {
  margin: 0;
}

.widget-item + .widget-item {
  margin-top: 8px;
}

.widget-item label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 2px;
  color: rgba(255, 255, 255, 0.84);
  transition: color 0.2s;
}

.widget-item label:hover {
  color: #fff;
}

input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkmark {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
  border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.checkmark::after {
  content: '';
  width: 10px;
  height: 6px;
  border-left: 2px solid #0f1513;
  border-bottom: 2px solid #0f1513;
  transform: translateY(-1px) rotate(-45deg) scale(0);
  transition: transform 0.18s ease;
}

input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(145deg, #9ce66f, #51b96d);
  border-color: rgba(188, 255, 162, 0.68);
  box-shadow: 0 8px 18px rgba(63, 182, 104, 0.22);
}

input[type="checkbox"]:checked + .checkmark::after {
  transform: translateY(-1px) rotate(-45deg) scale(1);
}

input[type="checkbox"]:focus-visible + .checkmark {
  box-shadow: 0 0 0 4px rgba(116, 199, 255, 0.16);
}

.custom-color-wrapper {
  position: relative;
  overflow: hidden;
}

.custom-color-dot {
  position: relative;
  background:
    conic-gradient(from 180deg at 50% 50%, #f04444 0deg, #f4d35e 70deg, #6ee7b7 145deg, #60a5fa 220deg, #a78bfa 290deg, #f04444 360deg);
}

.custom-color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
  -webkit-appearance: none;
}

.plus-icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);
}

@keyframes settings-panel-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 520px) {
  .settings-panel {
    right: -64px;
    padding: 20px;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
