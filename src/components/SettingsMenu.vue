<template>
  <div class="settings-menu-container">
    <button class="settings-btn" @click.stop="toggleMenu" :title="t('settings.title')">
      ⚙️
    </button>

    <div v-if="isOpen" class="settings-panel" @click.stop>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useWidgets } from '../composables/useWidgets';
import { useI18n } from 'vue-i18n';

const { widgets, toggleWidget } = useWidgets();
const { t } = useI18n();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
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
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 2000;
  color: #fff;
}

h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
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
</style>
